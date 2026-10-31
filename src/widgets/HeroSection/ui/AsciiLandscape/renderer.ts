import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders';

type Options = {
  canvas: HTMLCanvasElement;
  element: HTMLDivElement;
  container: HTMLElement;
  scene: HTMLImageElement;
  depth: HTMLImageElement;
  paused: boolean;
};

export type LandscapeController = {
  setPaused: (paused: boolean) => void;
  destroy: () => void;
};

const makeGlyphAtlas = () => {
  const atlas = document.createElement('canvas');
  atlas.width = 512;
  atlas.height = 48;
  const ctx = atlas.getContext('2d');
  if (!ctx) throw new Error('Canvas text rendering unavailable');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, atlas.width, atlas.height);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  '0123456789@#+:* '.split('').forEach((character, index) => {
    ctx.fillText(character, index * 32 + 16, 25);
  });
  return atlas;
};

export const createLandscapeRenderer = ({
  canvas,
  element,
  container,
  scene,
  depth,
  paused: initialPaused,
}: Options): LandscapeController => {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) throw new Error('WebGL unavailable');

  const shaders: WebGLShader[] = [];
  const textures: WebGLTexture[] = [];
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  const disposeGL = () => {
    textures.forEach((texture) => gl.deleteTexture(texture));
    shaders.forEach((shader) => gl.deleteShader(shader));
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
  };

  try {
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Unable to create landscape shader');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || 'Landscape shader compilation failed');
      }
      return shader;
    };
    const highPrecision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    program = gl.createProgram();
    if (!program) throw new Error('Unable to create landscape program');
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(
      program,
      compile(
        gl.FRAGMENT_SHADER,
        highPrecision?.precision
          ? FRAGMENT_SHADER
          : FRAGMENT_SHADER.replace('precision highp float;', 'precision mediump float;'),
      ),
    );
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Landscape program linking failed');
    }
    gl.useProgram(program);
    buffer = gl.createBuffer();
    if (!buffer) throw new Error('Unable to create landscape geometry');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    [scene, depth, makeGlyphAtlas()].forEach((source, unit) => {
      if (source.width > maxTexture || source.height > maxTexture) {
        throw new Error('Landscape texture exceeds this device limit');
      }
      const texture = gl.createTexture();
      if (!texture) throw new Error('Unable to create landscape texture');
      textures.push(texture);
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
      gl.uniform1i(gl.getUniformLocation(program!, ['u_scene', 'u_depth', 'u_glyphs'][unit]), unit);
    });
  } catch (error) {
    disposeGL();
    throw error;
  }

  const uniforms = Object.fromEntries(
    ['u_size', 'u_cover', 'u_scroll', 'u_time', 'u_cell'].map((name) => [
      name,
      gl.getUniformLocation(program!, name),
    ]),
  );
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');
  const scrollRoot = container.closest<HTMLElement>('[data-page-scroll]');
  let paused = initialPaused;
  let visible = true;
  let destroyed = false;
  let contextLost = false;
  let request = 0;
  let timer = 0;
  let lastFrame = 0;
  let activeTime = 0;
  let width = 0;
  let height = 0;
  let scroll = 0;
  let targetScroll = 0;
  let pixelRatio = 1;
  let slowFrames = 0;

  const draw = () => {
    if (destroyed || contextLost || !width || !height) return;
    gl.uniform1f(uniforms.u_scroll, scroll);
    gl.uniform1f(uniforms.u_time, activeTime);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const stop = () => {
    if (request) cancelAnimationFrame(request);
    if (timer) window.clearTimeout(timer);
    request = 0;
    timer = 0;
    lastFrame = 0;
    element.dataset.animating = 'false';
  };

  const frame = (now: number) => {
    request = 0;
    if (destroyed || contextLost) return;
    const interval = coarsePointer.matches ? 1000 / 24 : 1000 / 30;
    const elapsed = lastFrame ? now - lastFrame : interval;
    lastFrame = now;
    activeTime += Math.min(elapsed, 80) / 1000;
    const smoothing = 1 - Math.exp(-Math.min(elapsed, 80) / 130);
    scroll += (targetScroll - scroll) * smoothing;
    const started = performance.now();
    draw();
    // Sustained slow frames lower fill rate without changing the glyph size.
    const missedBudget = elapsed > interval * 1.8 || performance.now() - started > 12;
    slowFrames = missedBudget ? slowFrames + 1 : Math.max(0, slowFrames - 1);
    if (slowFrames > 18 && pixelRatio > 1) {
      pixelRatio = Math.max(1, pixelRatio - 0.25);
      updateSize(false);
      slowFrames = 0;
    }
    timer = window.setTimeout(
      () => {
        timer = 0;
        request = requestAnimationFrame(frame);
      },
      Math.max(0, interval - (performance.now() - now) - 3),
    );
  };

  const syncMotion = () => {
    stop();
    const reduced = reducedMotion.matches;
    element.dataset.motion = reduced ? 'reduced' : paused ? 'paused' : 'full';
    if (reduced) {
      scroll = targetScroll = 0;
    }
    if (reduced || paused) {
      draw();
    }
    if (!reduced && !paused && visible && !document.hidden && !destroyed && !contextLost) {
      updateScroll();
      element.dataset.animating = 'true';
      request = requestAnimationFrame(frame);
    }
  };

  const updateScroll = () => {
    if (paused || reducedMotion.matches || !visible || document.hidden || destroyed) return;
    const bounds = container.getBoundingClientRect();
    const rootTop = scrollRoot?.getBoundingClientRect().top ?? 0;
    targetScroll = Math.min(1, Math.max(0, (rootTop - bounds.top) / Math.max(1, bounds.height)));
  };

  const updateSize = (resetRatio = true) => {
    if (destroyed || contextLost) return;
    const bounds = element.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    if (resetRatio) {
      const maxRatio = coarsePointer.matches || width > 2100 ? 1 : 1.5;
      const pixelBudgetRatio = Math.sqrt(3_000_000 / (width * height));
      pixelRatio = Math.min(window.devicePixelRatio || 1, maxRatio, pixelBudgetRatio);
    }
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const aspect = width / height / (scene.naturalWidth / scene.naturalHeight);
    const portraitPlate = scene.naturalWidth < scene.naturalHeight && width < height;
    gl.uniform2f(uniforms.u_size, width, height);
    gl.uniform2f(
      uniforms.u_cover,
      portraitPlate ? 1 : Math.min(1, aspect),
      portraitPlate ? 1 : Math.min(1, 1 / aspect),
    );
    gl.uniform1f(
      uniforms.u_cell,
      coarsePointer.matches ? 7 : Math.min(11, Math.max(8, width / 220)),
    );
    element.dataset.quality = String(pixelRatio);
    updateScroll();
    draw();
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    stop();
    element.dataset.renderer = 'fallback';
  };

  canvas.addEventListener('webglcontextlost', onContextLost);
  (scrollRoot ?? window).addEventListener('scroll', updateScroll, { passive: true });
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);
  const onResize = () => updateSize();
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(element);
  window.addEventListener('resize', onResize, { passive: true });
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      syncMotion();
    },
    { root: scrollRoot, threshold: 0 },
  );
  observer.observe(container);
  updateSize();
  element.dataset.renderer = 'webgl';
  syncMotion();

  return {
    setPaused(value) {
      paused = value;
      syncMotion();
    },
    destroy() {
      destroyed = true;
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      (scrollRoot ?? window).removeEventListener('scroll', updateScroll);
      document.removeEventListener('visibilitychange', syncMotion);
      reducedMotion.removeEventListener('change', syncMotion);
      disposeGL();
    },
  };
};
