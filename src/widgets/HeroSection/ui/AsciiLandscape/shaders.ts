export const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = vec2(a_position.x * 0.5 + 0.5, 0.5 - a_position.y * 0.5);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_scene;
uniform sampler2D u_depth;
uniform sampler2D u_glyphs;
uniform vec2 u_size;
uniform vec2 u_cover;
uniform float u_scroll;
uniform float u_time;
uniform float u_cell;

float noise(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 sceneUV(vec2 uv) {
  vec2 covered = (uv - 0.5) * u_cover * vec2(0.94, 0.90) + vec2(0.53, 0.5);
  float depth = texture2D(u_depth, covered).r;
  float offset = u_scroll * (0.003 + depth * 0.042);
  return clamp(covered + vec2(0.0, offset), 0.002, 0.998);
}

float glyph(float index, vec2 local) {
  vec2 atlas = vec2((index + local.x) / 16.0, local.y);
  return texture2D(u_glyphs, atlas).r;
}

void main() {
  vec2 sourceUV = sceneUV(v_uv);
  vec3 continuous = texture2D(u_scene, sourceUV).rgb;
  float depth = texture2D(u_depth, sourceUV).r;
  float sea = smoothstep(0.12, 0.22, depth) * (1.0 - smoothstep(0.6, 0.77, depth));

  // Slow currents carry glyphs across the sea; the rock surface stays anchored.
  vec2 drift = vec2(u_time * 0.24 * sea, sin(u_time * 0.21 + v_uv.x * 8.0) * sea);
  vec2 cellSize = vec2(u_cell, u_cell * 1.5);
  vec2 grid = (v_uv * u_size + drift) / cellSize;
  vec2 id = floor(grid);
  vec2 local = fract(grid);
  vec2 cellUV = (id * cellSize + cellSize * 0.5 - drift) / u_size;
  vec3 sampleColor = texture2D(u_scene, sceneUV(cellUV)).rgb;
  float luminance = dot(sampleColor, vec3(0.2126, 0.7152, 0.0722));

  // Each cell has its own clock. Neighboring digits never flash in unison.
  float phase = u_time * (0.18 + noise(id + 5.0) * 0.24) + noise(id) * 9.0;
  float tick = floor(phase);
  float indexA = floor(noise(id + tick * vec2(3.1, 7.3)) * 10.0);
  float indexB = floor(noise(id + (tick + 1.0) * vec2(3.1, 7.3)) * 10.0);
  float ink = mix(glyph(indexA, local), glyph(indexB, local), smoothstep(0.72, 1.0, fract(phase)));

  float glint = pow(max(0.0, sin(v_uv.x * 7.5 + v_uv.y * 3.0 - u_time * 0.55 + u_scroll * 0.8)), 18.0);
  float detail = smoothstep(0.008, 0.10, luminance);
  float solidSurface = smoothstep(0.18, 0.7, depth);
  vec3 glyphColor = min(vec3(0.97), pow(sampleColor, vec3(0.66)) * (1.32 + glint * 0.22));
  vec3 floorColor = sampleColor * mix(0.58, 0.32, solidSurface) + vec3(0.001, 0.005, 0.012);
  vec3 ascii = floorColor + (vec3(1.0) - floorColor) * glyphColor * ink * mix(0.32, 1.0, detail);
  float warmClouds = smoothstep(0.01, 0.18, continuous.r - continuous.b * 0.92);
  warmClouds *= smoothstep(0.2, 0.5, dot(continuous, vec3(0.2126, 0.7152, 0.0722)));
  vec2 readingArea = (v_uv - vec2(0.54, 0.48)) / vec2(0.36, 0.24);
  warmClouds *= smoothstep(0.6, 1.0, length(readingArea));
  float asciiMix = smoothstep(0.045, 0.18, depth);
  // Clouds carry lighter glyph impressions, retaining their airy luminance.
  vec3 cloudAscii = continuous * (0.82 + ink * 0.32);
  // Far sky remains quiet and smooth so the HTML headline is always readable.
  vec3 color = mix(mix(continuous, cloudAscii, warmClouds), ascii, asciiMix);
  gl_FragColor = vec4(color, 1.0);
}
`;
