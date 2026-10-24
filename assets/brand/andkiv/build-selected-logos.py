#!/usr/bin/env python3
"""Save selected directions 01, 03, 06 and build the requested 01+03 combination."""
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import sys
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "selected-logos"
spec = importlib.util.spec_from_file_location("andkiv_builder", ROOT / "build-assets.py")
builder = importlib.util.module_from_spec(spec)
sys.dont_write_bytecode = True
spec.loader.exec_module(builder)
NS = {"svg": "http://www.w3.org/2000/svg"}

def combined(theme):
    mono = theme == "mono"
    ink = "currentColor" if mono else ("#FFF4E7" if theme == "dark" else "#38223A")
    accent = ink if mono else (builder.PEACH if theme == "dark" else "#56314F")
    # The symbol placement is copied from direction 01.
    symbol = builder.at(12, 22, 192, accent)
    # Direction 03 typography, restored to a full i glyph with its ordinary dot.
    text, width, _ = builder.text_at(
        "andkiv", "black", 192, 226, 190, ink, -5, stem_i=False
    )
    return builder.svg(
        width + 250, 240,
        f"andkiv / Спутник Black / {theme}",
        symbol + text,
        "Direction 01 symbol plus direction 03 Black wordmark. Standard i dot. All lettering outlined.",
    )

def make_preview(entries):
    image = Image.new("RGB", (1760, 1110), "#151217")
    draw = ImageDraw.Draw(image)
    draw.text((80, 46), "ANDKIV / SELECTED LOGOS", font=builder.preview_font(18, True), fill="#B6ABB7")
    draw.text((80, 90), "Три выбранных и один новый", font=builder.preview_font(46, True), fill="#FFF4E7")
    draw.text((80, 153), "01, 03 и 06 сохранены · 07 объединяет знак 01 и надпись 03", font=builder.preview_font(23), fill="#B6ABB7")
    for i, entry in enumerate(entries):
        x, y = 80 + (i % 2) * 820, 218 + (i // 2) * 416
        light = entry["number"] == 6
        bg, fg = ("#F7F0E5", "#38223A") if light else ("#261C2A", "#FFF4E7")
        outline = "#BC8D7D" if entry["number"] == 7 else None
        draw.rounded_rectangle((x, y, x+780, y+366), radius=28, fill=bg, outline=outline, width=2)
        draw.text((x+28, y+24), f'{entry["number"]:02d} / {entry["displayName"]}', font=builder.preview_font(22, True), fill=fg)
        if entry["number"] == 7:
            draw.text((x+635, y+28), "НОВЫЙ", font=builder.preview_font(18, True), fill="#FFC69F")
        with Image.open(OUT / entry["id"] / ("light.png" if light else "dark.png")) as source:
            art = source.convert("RGBA")
        art.thumbnail((668, 210), Image.Resampling.LANCZOS)
        image.paste(art, (x+(780-art.width)//2, y+84+(210-art.height)//2), art)
        draw.text((x+28, y+319), entry["caption"], font=builder.preview_font(20), fill="#7B697A" if light else "#BFB0BE")
    draw.text((80, 1062), "В каждой папке: светлая, тёмная и монохромная версии · SVG и прозрачные PNG", font=builder.preview_font(20), fill="#B6ABB7")
    image.save(OUT / "selected-logos.png", optimize=True)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    entries = []
    for stem, number, name, caption in [
        ("01-companion", 1, "СПУТНИК", "Исходный вариант 01"),
        ("03-playful-i", 3, "ЖИВОЙ i", "Исходный вариант 03"),
        ("06-capsule", 6, "КАПСУЛА", "Исходный вариант 06"),
    ]:
        target = OUT / stem
        target.mkdir(exist_ok=True)
        for theme in ("light", "dark", "mono"):
            source_svg = ROOT / f"svg/logos/{stem}-{theme}.svg"
            source_png = ROOT / f"previews/logos/{stem}-{theme}.png"
            shutil.copy2(source_svg, target / f"{theme}.svg")
            shutil.copy2(source_png, target / f"{theme}.png")
            assert source_svg.read_bytes() == (target / f"{theme}.svg").read_bytes()
            assert source_png.read_bytes() == (target / f"{theme}.png").read_bytes()
        entries.append({"id": stem, "number": number, "displayName": name, "caption": caption, "source": f"../svg/logos/{stem}-<theme>.svg"})
    stem = "07-companion-black"
    target = OUT / stem
    target.mkdir(exist_ok=True)
    for theme in ("light", "dark", "mono"):
        svg = target / f"{theme}.svg"
        svg.write_text(combined(theme))
        builder.render(svg, 1200, target / f"{theme}.png")
    entries.append({"id": stem, "number": 7, "displayName": "СПУТНИК BLACK", "caption": "Знак 01 + надпись 03 · обычная точка над i", "derivedFrom": [1, 3], "wordmark": {"font": "Pretendard Black", "size": 192, "tracking": -5, "standardIDot": True}})
    for entry in entries:
        entry["files"] = {theme: {"svg": f'{entry["id"]}/{theme}.svg', "png": f'{entry["id"]}/{theme}.png'} for theme in ("light", "dark", "mono")}
    make_preview(entries)
    records = []
    for entry in entries:
        for theme in ("light", "dark", "mono"):
            path = OUT / entry["files"][theme]["svg"]
            tree = ET.parse(path)
            nodes = list(tree.iter())
            assert not {n.tag.rsplit("}", 1)[-1] for n in nodes} & {"image", "text", "script", "foreignObject"}
            ids = [n.get("id") for n in nodes if n.get("id")]
            assert len(ids) == len(set(ids)), path
            with Image.open(OUT / entry["files"][theme]["png"]) as image:
                assert image.mode == "RGBA" and image.width == 1200
                assert image.getbbox() is not None
                image.load()
            if entry["number"] == 7:
                original = ET.parse(ROOT / f"svg/logos/01-companion-{theme}.svg")
                original_mark = original.find('.//svg:path[@id="mascot-mark"]', NS)
                mark = tree.find('.//svg:path[@id="mascot-mark"]', NS)
                assert original_mark.attrib == mark.attrib
                assert len([n for n in nodes if n.get("id") == "mascot"]) == 1
                new_glyphs = {n.get("data-glyph"): n.get("d") for n in nodes if n.get("data-glyph")}
                old_tree = ET.parse(ROOT / f"svg/logos/03-playful-i-{theme}.svg")
                old_glyphs = {n.get("data-glyph"): n.get("d") for n in old_tree.iter() if n.get("data-glyph")}
                for char in "andkv":
                    assert new_glyphs[char] == old_glyphs[char], char
                assert new_glyphs["i"].count("M") == 2, "Expected i stem and ordinary dot"
                assert old_glyphs["i"].count("M") == 1
            records.append({"file": str(path.relative_to(OUT)), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    manifest = {"brand": "andkiv", "selectedOriginalDirections": [1, 3, 6], "newDirection": 7, "logos": entries, "validation": {"svgFiles": len(records), "pngFiles": len(records), "preservedOriginals": True, "newWordmarkMatches03": True, "newSymbolMatches01": True, "standardIDot": True}, "checksums": records}
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+"\n")
    print(json.dumps(manifest["validation"], ensure_ascii=False))

if __name__ == "__main__":
    main()

