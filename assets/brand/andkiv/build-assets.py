#!/usr/bin/env python3
"""Build portable SVG brand assets and PNG previews from editable geometry."""
from __future__ import annotations
import html
import io
import json
import math
from pathlib import Path
import re
import shutil
import subprocess

from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.svgLib.path import parse_path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
GEO = json.loads((ROOT / "source/geometry.json").read_text())
BODY = GEO["bodyPath"]
EYES = GEO["eyes"]
PEACH, INK, CREAM = "#FFC69F", "#452D49", "#FFF4E7"
SIZES = (16, 24, 32, 48, 64, 96, 128, 180, 192, 256, 512, 1024)
TILE = "M128 16H384C460 16 496 52 496 128V384C496 460 460 496 384 496H128C52 496 16 460 16 384V128C16 52 52 16 128 16Z"

def num(v):
    return f"{v:.3f}".rstrip("0").rstrip(".")

def clean(d):
    return re.sub(r"-?\d+\.\d+(?:[eE][+-]?\d+)?", lambda m: num(float(m[0])), d)

def path_transform(d, matrix):
    pen = SVGPathPen(None)
    parse_path(d, TransformPen(pen, matrix))
    return clean(pen.getCommands())

def eye_path(eye):
    cx, cy, w, h = (eye[k] for k in ("cx", "cy", "width", "height"))
    r = w / 2
    y0, y1 = -h/2+r, h/2-r
    k = 0.5522847498307936
    d = (f"M{-r} {y0}C{-r} {y0-k*r} {-k*r} {-h/2} 0 {-h/2}"
         f"C{k*r} {-h/2} {r} {y0-k*r} {r} {y0}L{r} {y1}"
         f"C{r} {y1+k*r} {k*r} {h/2} 0 {h/2}"
         f"C{-k*r} {h/2} {-r} {y1+k*r} {-r} {y1}Z")
    a = math.radians(eye["rotation"])
    return path_transform(d, (math.cos(a), math.sin(a), -math.sin(a), math.cos(a), cx, cy))

EYE_PATHS = [eye_path(e) for e in EYES]
CUTOUT = BODY + "".join(EYE_PATHS)

def svg(w, h, title, content, desc="", color=INK):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{num(w)}" height="{num(h)}" '
            f'viewBox="0 0 {num(w)} {num(h)}" fill="none" color="{color}" role="img" aria-labelledby="title desc">\n'
            f'<title id="title">{html.escape(title)}</title>\n<desc id="desc">{html.escape(desc)}</desc>\n'
            f'{content}\n</svg>\n')

def write(relative, content):
    path = ROOT / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)
    return path

def eyes(fill, prefix=""):
    return "".join(
        f'<g id="{prefix}{eye["id"]}" data-layer="{eye["id"]}" transform="rotate({eye["rotation"]} {eye["cx"]} {eye["cy"]})">'
        f'<rect x="{num(eye["cx"]-eye["width"]/2)}" y="{num(eye["cy"]-eye["height"]/2)}" '
        f'width="{eye["width"]}" height="{eye["height"]}" rx="{num(eye["width"]/2)}" fill="{fill}"/></g>'
        for eye in EYES)

def mascot(body=PEACH, eye=INK, mode="color"):
    if mode == "cutout":
        return f'<path id="mascot-mark" d="{CUTOUT}" fill="{body}" fill-rule="evenodd"/>'
    if mode == "outline":
        return f'<path id="body" d="{BODY}" fill="none" stroke="{body}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>{eyes(body)}'
    return f'<g id="body" data-layer="body"><path d="{BODY}" fill="{body}"/></g>{eyes(eye)}'

def at(x, y, size, body=PEACH, eye=INK, mode="cutout"):
    return f'<g id="mascot" transform="translate({num(x)} {num(y)}) scale({num(size/512)})">{mascot(body, eye, mode)}</g>'

def make_mascots():
    for filename, body, eye, mode in [
        ("mascot", PEACH, INK, "color"),
        ("mascot-ink", "currentColor", "", "cutout"),
        ("mascot-light", CREAM, "", "cutout"),
        ("mascot-outline", "currentColor", "", "outline"),
    ]:
        write(f"svg/mascot/{filename}.svg", svg(512,512, "andkiv / editable mascot", mascot(body,eye,mode),
              "Selected silhouette. Independent body and eye-left / eye-right groups. True vector geometry."))
    sprite = (f'<svg xmlns="http://www.w3.org/2000/svg"><symbol id="andkiv-mascot" viewBox="0 0 512 512">'
              f'<path d="{CUTOUT}" fill="currentColor" fill-rule="evenodd"/></symbol></svg>\n')
    write("svg/mascot/sprite.svg", sprite)

def make_icons():
    gradients = """
<linearGradient id="peach" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFDEAD"/><stop offset="1" stop-color="#FFAE89"/></linearGradient>
<linearGradient id="plum" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#A55A7D"/><stop offset=".5" stop-color="#542B53"/><stop offset="1" stop-color="#351438"/></linearGradient>
<linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#F1F3FF"/><stop offset=".6" stop-color="#CDD4EB"/><stop offset="1" stop-color="#A7A9D2"/></linearGradient>
<linearGradient id="night" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#241335"/><stop offset=".5" stop-color="#130B20"/><stop offset="1" stop-color="#260D3B"/></linearGradient>
<linearGradient id="emission" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#FFFFFF"/><stop offset=".5" stop-color="#FFF1FF"/><stop offset="1" stop-color="#F3B4FF"/></linearGradient>
<linearGradient id="pastel" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#F8B9F1"/><stop offset=".5" stop-color="#F8F5FF"/><stop offset="1" stop-color="#C8F6EB"/></linearGradient>
<linearGradient id="pink" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#FE70E9"/><stop offset="1" stop-color="#F100B8"/></linearGradient>
<linearGradient id="petal-base" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ECA3E7"/><stop offset=".45" stop-color="#9F3497"/><stop offset="1" stop-color="#26072F"/></linearGradient>
<linearGradient id="petal" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#FFB2F7" stop-opacity=".62"/><stop offset=".6" stop-color="#722268" stop-opacity=".55"/><stop offset="1" stop-color="#18071F" stop-opacity=".9"/></linearGradient>
<linearGradient id="blue" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#8CCBFF"/><stop offset=".5" stop-color="#3A96FA"/><stop offset="1" stop-color="#0C5CE9"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#E3FAFF" stop-opacity=".5"/><stop offset=".35" stop-color="#EAFBFF" stop-opacity=".12"/><stop offset="1" stop-color="#E0F8FF" stop-opacity=".58"/></linearGradient>
<linearGradient id="shine" x1="0" y1="0" x2="1" y2="1"><stop stop-color="white" stop-opacity=".95"/><stop offset=".5" stop-color="white" stop-opacity=".12"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
<radialGradient id="frost" cx=".5" cy="1" r=".8"><stop stop-color="#ECFCFF" stop-opacity=".82"/><stop offset=".45" stop-color="#DBF7FF" stop-opacity=".35"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
<linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop stop-color="white" stop-opacity=".72"/><stop offset=".5" stop-color="white" stop-opacity=".08"/><stop offset="1" stop-color="white" stop-opacity=".3"/></linearGradient>
<filter id="bloom" x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="4"/></filter>
"""
    paths = []
    for index, name in enumerate(["peach", "chrome-pop", "neon-bloom", "pastel-graphic", "petal-gradient", "ink-sketch", "liquid-glass"]):
        definitions = f'<defs>{gradients}<clipPath id="tile-clip"><path d="{TILE}"/></clipPath><clipPath id="body-clip"><path d="{BODY}"/></clipPath></defs>'
        fill = ["url(#plum)", "url(#silver)", "url(#night)", "url(#pastel)", "url(#pink)", "#F4F1E9", "url(#blue)"][index]
        tile = f'<path id="tile" d="{TILE}" fill="{fill}"/>'
        underlay = ""
        if index == 0:
            art = mascot("url(#peach)", INK)
        elif index == 1:
            ribbon = '<g clip-path="url(#tile-clip)"><path d="M0 175L510 119L475 161L512 190L0 243L43 208Z" fill="#FF10C6"/></g>'
            underlay = ribbon
            art = mascot("#190D29", "#FF10C6")
        elif index == 2:
            halo = f'<path d="{BODY}" fill="#F03AFF" filter="url(#bloom)" opacity=".95"/>'
            art = halo + mascot("url(#emission)", "#210B31")
        elif index == 3:
            art = mascot("#1C102C", "#F7E5FA")
        elif index == 4:
            sheets = [
                "M80 108C215 88 355 212 312 476C165 412 63 230 80 108Z",
                "M260 28C393 176 386 333 253 485C191 323 171 147 260 28Z",
                "M468 104C479 287 386 411 251 486C259 281 339 163 468 104Z",
                "M55 291C209 218 374 299 466 448C277 494 143 419 55 291Z",
            ]
            art = f'<path id="body" d="{BODY}" fill="url(#petal-base)"/>'
            art += '<g id="petal-layers" clip-path="url(#body-clip)">' + "".join(f'<path d="{p}" fill="url(#petal)"/>' for p in sheets) + "</g>" + eyes("#FFD3F5")
        elif index == 5:
            art = f'<path id="body" d="{BODY}" fill="#FAF8F2" stroke="#151515" stroke-width="12" stroke-linejoin="round"/>' + eyes("#151515")
        else:
            art = f'<path id="body" d="{BODY}" fill="url(#glass)" stroke="#E3FAFF" stroke-width="3"/>'
            art += f'<path d="{BODY}" fill="url(#frost)"/>'
            art += ('<g id="glass-reflections" clip-path="url(#body-clip)">'
                    '<path d="M134 210C151 119 203 77 288 68C205 106 178 150 155 230C148 246 135 242 134 210Z" fill="url(#shine)" filter="url(#soft)" opacity=".75"/>'
                    '<ellipse cx="278" cy="448" rx="176" ry="43" fill="#DCFAFF" opacity=".44" filter="url(#soft)"/></g>')
            art += '<g filter="url(#soft)" opacity=".55">' + eyes("#FFFFFF", "glow-") + "</g>" + eyes("#FFFFFF")
        rim = f'<path d="{TILE}" fill="none" stroke="url(#rim)" stroke-width="2"/>'
        art = f'<g id="character" transform="translate(61.44 67.4) scale(.76)">{art}</g>'
        path = write(f"svg/icons/{index:02d}-{name}.svg", svg(512,512,f"andkiv / {name}", definitions+tile+underlay+art+rim,
                     "Editable vector interpretation of the selected mascot and app-icon style."))
        paths.append(path)
    return paths

FONT_PATHS = {
    "bold": REPO/"src/shared/styles/fonts/Pretendard/Pretendard-Bold.woff2",
    "black": REPO/"src/shared/styles/fonts/Pretendard/Pretendard-Black.woff2",
    "medium": REPO/"src/shared/styles/fonts/Pretendard/Pretendard-Medium.woff2",
    "hand": REPO/"src/shared/styles/fonts/Caveat/Caveat-Bold.ttf",
}
FONTS = {}

def font_data(style):
    if style not in FONTS:
        f = TTFont(FONT_PATHS[style])
        FONTS[style] = (f, f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm)
    return FONTS[style]

def glyph_contours(glyph):
    record = RecordingPen()
    glyph.draw(record)
    pieces, current = [], []
    for command in record.value:
        if command[0] == "moveTo" and current:
            pieces.append(current)
            current = []
        current.append(command)
        if command[0] in ("closePath", "endPath"):
            pieces.append(current)
            current = []
    if current:
        pieces.append(current)
    return pieces

def word(text="andkiv", style="bold", size=168, tracking=-4, stem_i=False):
    f, gs, cmap, units = font_data(style)
    scale = size/units
    cursor, fragments, metrics = 0.0, [], []
    for index, char in enumerate(text):
        if char.isspace():
            cursor += size*0.3 + tracking
            continue
        glyph_name = cmap[ord(char)]
        glyph = gs[glyph_name]
        pen = SVGPathPen(gs)
        transform = TransformPen(pen, (scale,0,0,-scale,cursor,0))
        bp = BoundsPen(gs)
        glyph.draw(bp)
        if stem_i and char == "i":
            contours = glyph_contours(glyph)
            ranked = []
            for commands in contours:
                bounds = BoundsPen(gs)
                rec = RecordingPen()
                rec.value = commands
                rec.replay(bounds)
                if bounds.bounds:
                    ranked.append((bounds.bounds[1], commands, bounds.bounds))
            _, commands, bounds = min(ranked, key=lambda entry: entry[0])
            rec = RecordingPen()
            rec.value = commands
            rec.replay(transform)
            metrics.append({"char":char,"x":cursor,"bounds":bounds,"scale":scale})
        else:
            glyph.draw(transform)
            metrics.append({"char":char,"x":cursor,"bounds":bp.bounds,"scale":scale})
        d = clean(pen.getCommands())
        if d:
            fragments.append(f'<path data-glyph="{char}" d="{d}"/>')
        cursor += f["hmtx"][glyph_name][0]*scale + tracking
    return "".join(fragments), cursor-tracking, metrics

def text_at(text, style, size, x, baseline, fill, tracking=-4, stem_i=False, group_id="wordmark"):
    d, width, metrics = word(text, style, size, tracking, stem_i)
    return f'<g id="{group_id}" transform="translate({num(x)} {num(baseline)})" fill="{fill}">{d}</g>', width, metrics

LOGOS = [
    ("01-companion","Спутник","Персонаж рядом с andkiv. Основной вариант для шапки сайта."),
    ("02-editorial","Редакционный","Крупный ANDKIV, небольшая фигура и подпись DESIGN / CODE / MOTION."),
    ("03-playful-i","Живой i","Персонаж заменяет точку над i. Выразительная версия для крупного размещения."),
    ("04-stacked","Эмблема","Персонаж над подписью. Компактная вертикальная композиция."),
    ("05-signature","Подпись","Контурный персонаж и рукописный andkiv на основе Caveat."),
    ("06-capsule","Капсула","Контрастная плашка с персонажем и плотной надписью."),
]

def make_logo(index, theme):
    mono = theme == "mono"
    ink = "currentColor" if mono else ("#FFF4E7" if theme=="dark" else "#38223A")
    accent = ink if mono else (PEACH if theme=="dark" else "#56314F")
    defs = ""
    if index == 0:
        text, tw, _ = text_at("andkiv","bold",168,226,180,ink,-5)
        w, h = tw+250, 240
        art = at(12,22,192,accent) + text
    elif index == 1:
        text, tw, _ = text_at("ANDKIV","black",150,22,166,ink,-4)
        w, h = tw+206, 250
        tag, _, _ = text_at("DESIGN / CODE / MOTION","medium",19,27,218,ink,2.8,group_id="tagline")
        art = text + at(tw+54,40,132,ink) + tag
    elif index == 2:
        text, tw, metrics = text_at("andkiv","black",192,28,230,ink,-5,True)
        metric = next(m for m in metrics if m["char"]=="i")
        x0,y0,x1,y1 = metric["bounds"]
        center = 28+metric["x"]+(x0+x1)/2*metric["scale"]
        stem_top = 230-y1*metric["scale"]
        mark_size = 62
        # Visual bounds of the mascot include 6% breathing room.
        art = text + at(center-mark_size/2, stem_top-mark_size-4, mark_size,accent)
        w,h = tw+56, 268
    elif index == 3:
        _,tw,_ = word("andkiv","bold",128,-3)
        w,h = max(tw+88,440),430
        text,_,_ = text_at("andkiv","bold",128,(w-tw)/2,334,ink,-3)
        tag,tagw,_ = text_at("CREATIVE DEVELOPER","medium",17,0,0,ink,2.6,group_id="tagline")
        # The extra wrapper preserves outlined type and its natural spacing.
        tag = f'<g transform="translate({num((w-tagw)/2)} 382)">{tag}</g>'
        art = at((w-190)/2,8,190,accent) + text + tag
    elif index == 4:
        text,tw,_ = text_at("andkiv","hand",192,212,192,ink,-1)
        w,h = tw+244,260
        underline = f'<path id="signature-stroke" d="M225 216Q{num((w+225)/2)} 199 {num(w-26)} 211" stroke="{accent}" stroke-width="5" stroke-linecap="round"/>'
        art = at(12,28,182,ink,mode="outline") + text + underline
    else:
        text,tw,_ = text_at("andkiv","black",144,222,162,ink,-4)
        w,h = tw+260,226
        if mono:
            panel = f'<rect x="2" y="2" width="{num(w-4)}" height="222" rx="111" stroke="currentColor" stroke-width="3"/>'
            art = panel + at(20,25,176,ink) + text
        else:
            bg = PEACH if theme=="dark" else "#38223A"
            fg = "#38223A" if theme=="dark" else CREAM
            mark = "#38223A" if theme=="dark" else PEACH
            text,_,_ = text_at("andkiv","black",144,222,162,fg,-4)
            art = f'<rect width="{num(w)}" height="226" rx="113" fill="{bg}"/>' + at(20,25,176,mark) + text
    return svg(w,h,f"andkiv / {LOGOS[index][1]} / {theme}",defs+art,
               "Logo concept. All lettering is outlined. Transparent background. No embedded fonts or images.")

def render(path, width, output):
    output.parent.mkdir(parents=True,exist_ok=True)
    subprocess.run(["rsvg-convert","--width",str(width),str(path),"--output",str(output)],check=True,capture_output=True)

def preview_font(size,bold=False):
    path = Path("/System/Library/Fonts/Supplemental")/("Arial Bold.ttf" if bold else "Arial.ttf")
    if not path.exists():
        path = Path("/usr/share/fonts/truetype/dejavu")/("DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf")
    return ImageFont.truetype(str(path),size)

def logo_board():
    board = Image.new("RGB",(1760,1640),"#151217")
    d = ImageDraw.Draw(board)
    d.text((80,48),"ANDKIV / VECTOR IDENTITY",font=preview_font(18,True),fill="#B6ABB7")
    d.text((80,91),"Один персонаж. Шесть логотипов.",font=preview_font(46,True),fill="#FFF4E7")
    d.text((80,157),"Разные композиции и типографика · Все элементы в SVG-кривых",font=preview_font(24),fill="#B6ABB7")
    for index,(stem,name,desc) in enumerate(LOGOS):
        x,y = 80+(index%2)*820,225+(index//2)*440
        dark = index%2==0
        bg = "#261C2A" if dark else "#F7F0E5"
        fg = "#FFF4E7" if dark else "#38223A"
        secondary = "#BFB0BE" if dark else "#7B697A"
        d.rounded_rectangle((x,y,x+780,y+390),radius=28,fill=bg)
        d.text((x+28,y+24),f"{index+1:02d} / {name.upper()}",font=preview_font(20,True),fill=fg)
        theme = "dark" if dark else "light"
        art = Image.open(ROOT/f"previews/logos/{stem}-{theme}.png").convert("RGBA")
        art.thumbnail((665,242),Image.Resampling.LANCZOS)
        px,py = x+(780-art.width)//2,y+79+(242-art.height)//2
        board.paste(art,(px,py),art)
        captions = ["Для шапки сайта и навигации","Для обложек и презентаций","Персонаж вместо точки над i","Для аватара, карточки и подписи","Для авторского портфолио","Для компактного бейджа и кнопки"]
        d.text((x+28,y+346),captions[index],font=preview_font(20),fill=secondary)
    d.text((80,1585),"Светлые, тёмные и монохромные версии каждого логотипа — в комплекте.",font=preview_font(20),fill="#B6ABB7")
    board.save(ROOT/"previews/logo-directions.png",optimize=True)

def icon_board(icon_paths):
    board = Image.new("RGB",(1680,1420),"#151217")
    d = ImageDraw.Draw(board)
    d.text((96,54),"ANDKIV / NATIVE SVG",font=preview_font(18,True),fill="#B6ABB7")
    d.text((96,98),"Те же шесть стилей — теперь в SVG",font=preview_font(44,True),fill="#FFF4E7")
    labels = ["ХРОМ + ФУКСИЯ","НЕОНОВОЕ СВЕЧЕНИЕ","ПАСТЕЛЬНАЯ ГРАФИКА","ЛЕПЕСТКОВЫЕ СЛОИ","КОНТУРНЫЙ СКЕТЧ","ЖИДКОЕ СТЕКЛО"]
    for i,path in enumerate(icon_paths[1:]):
        x,y = 96+(i%3)*520,198+(i//3)*570
        icon=Image.open(ROOT/f"png/icons/{path.stem}/512.png").convert("RGBA")
        icon=icon.resize((448,448),Image.Resampling.LANCZOS)
        board.paste(icon,(x,y),icon)
        d.text((x,y+470),f"{i+1:02d} / {labels[i]}",font=preview_font(22,True),fill="#FFF4E7")
    d.text((96,1360),"Редактируемые пути, градиенты и фильтры · Без встроенных растров",font=preview_font(20),fill="#B6ABB7")
    board.save(ROOT/"previews/svg-icons.png",optimize=True)

def mascot_board():
    board=Image.new("RGB",(1500,760),"#151217")
    d=ImageDraw.Draw(board)
    d.text((70,45),"Канонический силуэт — редактируемый SVG",font=preview_font(36,True),fill="#FFF4E7")
    for i,name in enumerate(["mascot","mascot-ink","mascot-outline"]):
        x=70+i*470
        bg="#38223A" if i==0 else "#F7F0E5"
        d.rounded_rectangle((x,125,x+430,565),radius=26,fill=bg)
        art=Image.open(ROOT/f"previews/mascot/{name}.png").convert("RGBA")
        art=art.resize((390,390),Image.Resampling.LANCZOS)
        board.paste(art,(x+20,145),art)
        labels=["Цветной · корпус + два глаза","Монохром · прозрачные глаза","Контур · отдельные глаза"]
        d.text((x,598),labels[i],font=preview_font(22),fill="#FFF4E7")
    d.text((70,690),"17 кубических кривых в силуэте · Независимые группы для анимации",font=preview_font(22),fill="#B6ABB7")
    board.save(ROOT/"previews/mascot-construction.png",optimize=True)

def main():
    if not shutil.which("rsvg-convert"):
        raise SystemExit("rsvg-convert is required for PNG export")
    make_mascots()
    icon_paths=make_icons()
    logo_records=[]
    for index,(stem,name,desc) in enumerate(LOGOS):
        record={"id":stem,"number":index+1,"name":name,"description":desc,"files":{}}
        for theme in ["light","dark","mono"]:
            path=write(f"svg/logos/{stem}-{theme}.svg",make_logo(index,theme))
            record["files"][theme]=str(path.relative_to(ROOT))
            render(path,1200,ROOT/f"previews/logos/{stem}-{theme}.png")
        logo_records.append(record)
    for path in icon_paths:
        for size in SIZES:
            render(path,size,ROOT/f"png/icons/{path.stem}/{size}.png")
        frames=[Image.open(ROOT/f"png/icons/{path.stem}/{size}.png") for size in (16,32,48)]
        frames[-1].save(ROOT/f"png/icons/{path.stem}/favicon.ico",format="ICO",sizes=[(16,16),(32,32),(48,48)],append_images=frames[:-1])
    for path in sorted((ROOT/"svg/mascot").glob("*.svg")):
        if path.stem!="sprite":
            render(path,1024,ROOT/f"previews/mascot/{path.stem}.png")
    logo_board()
    icon_board(icon_paths)
    mascot_board()
    manifest={"brand":"andkiv","date":"2026-10-24","branch":"codex/kiv-mascot-assets","mascotName":None,"geometry":"source/geometry.json","bodyCubicSegments":17,"fontSources":{key:str(value.relative_to(REPO)) for key,value in FONT_PATHS.items()},"logos":logo_records,"icons":[{"svg":str(path.relative_to(ROOT)),"pngFolder":f"png/icons/{path.stem}","sizes":SIZES} for path in icon_paths],"notes":["All SVGs are native vector paths with no embedded images or external fonts.","Lettering is outlined; font choices come from the existing portfolio project.","Gradient, neon and glass SVGs are vector interpretations of the generated renders.","No live site assets have been replaced."]}
    write("manifest.json",json.dumps(manifest,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps({"svg_files":len(list((ROOT/"svg").rglob("*.svg"))),"icon_pngs":len(icon_paths)*len(SIZES),"logo_directions":len(LOGOS),"previews":["logo-directions.png","svg-icons.png","mascot-construction.png"]},ensure_ascii=False))

if __name__=="__main__":
    main()

