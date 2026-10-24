#!/usr/bin/env python3
"""Resize concept PNGs and assemble comparison sheets without changing their artwork."""

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


SIZES = (16, 32, 48, 64, 128, 256, 512, 1024)
BG = "#111215"
WHITE = "#F3F1E9"
MUTED = "#92959D"


def font(size, bold=False):
    candidates = [
        Path('/System/Library/Fonts/Supplemental') / ('Arial Bold.ttf' if bold else 'Arial.ttf'),
        Path('/usr/share/fonts/truetype/dejavu') / ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf'),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    raise RuntimeError('Install Arial or DejaVu Sans to render Cyrillic labels.')


def entry_palette(entry):
    return entry.get('palette', entry.get('targetPalette', []))


def shortened(draw, text, max_width, selected_font):
    while draw.textlength(text, font=selected_font) > max_width:
        text = text[:-2].rstrip() + '…'
    return text


def prepare(root):
    data = json.loads((root / 'manifest.json').read_text())
    entries = ([data['reference']] if 'reference' in data else []) + data['concepts']
    originals = {}
    for entry in entries:
        with Image.open(root / entry['source']) as original:
            original.load()
            if original.width != original.height:
                raise ValueError(f"Non-square source: {entry['source']}")
            originals[entry['id']] = original.convert('RGB')
        target = root / 'png' / entry['id']
        target.mkdir(parents=True, exist_ok=True)
        for size in SIZES:
            originals[entry['id']].resize((size, size), Image.Resampling.LANCZOS).save(target / f'{size}.png', optimize=True)

    sheet = Image.new('RGB', (1680, 1460), BG)
    draw = ImageDraw.Draw(sheet)
    draw.text((96, 56), 'ANDKIV  /  MASCOT EXPLORATIONS', font=font(18, True), fill=MUTED)
    draw.text((96, 98), data.get('title', 'Шесть направлений персонажа'), font=font(46, True), fill=WHITE)
    draw.text((96, 160), data.get('subtitle', 'Шесть характеров и шесть цветовых решений'), font=font(24), fill=MUTED)
    for index, entry in enumerate(entries):
        x = 96 + (index % 3) * 520
        y = 218 + (index // 3) * 588
        icon = originals[entry['id']].resize((448, 448), Image.Resampling.LANCZOS)
        sheet.paste(icon, (x, y))
        display_name = entry.get('displayName', entry['name'])
        label = '00  ИСХОДНЫЙ' if entry.get('number') == 0 else f"{entry['number']:02d}  {display_name.upper()}"
        draw.text((x, y + 466), label, font=font(28, True), fill=WHITE)
        for swatch, color in enumerate(entry_palette(entry)[:3]):
            sx = x + 359 + swatch * 31
            draw.ellipse((sx, y + 473, sx + 21, y + 494), fill=color, outline='#54565D', width=1)
        summary = entry.get('caption', entry.get('summary', entry.get('description', '')))
        summary = shortened(draw, summary, 448, font(18))
        draw.text((x, y + 511), summary, font=font(18), fill=MUTED)
    draw.line((96, 1386, 1584, 1386), fill='#303239', width=1)
    draw.text((96, 1410), 'Контрастная палитра · Мягкий силуэт · Простая анимация', font=font(18), fill=MUTED)
    draw.text((1472, 1410), '24.10.2026', font=font(18), fill=MUTED)
    sheet.save(root / 'contact-sheet.png', optimize=True)

    small = Image.new('RGB', (1440, 1110), BG)
    draw = ImageDraw.Draw(small)
    draw.text((64, 46), 'Читаемость в малых размерах', font=font(36, True), fill=WHITE)
    draw.text((64, 98), 'Растровые превью концептов · размеры показаны без увеличения', font=font(21), fill=MUTED)
    cols = [(400, 16), (510, 32), (640, 48), (800, 64), (1040, 128)]
    for x, size in cols:
        draw.text((x, 154), f'{size} px', font=font(19), fill=MUTED)
    for index, entry in enumerate(entries):
        y = 205 + index * 144
        draw.text((64, y + 45), f"{entry['number']:02d}  {entry['name']}", font=font(25, True), fill=WHITE)
        for x, size in cols:
            icon = Image.open(root / 'png' / entry['id'] / f'{size}.png')
            small.paste(icon, (x, y + (128 - size) // 2))
    small.save(root / 'small-sizes.png', optimize=True)
    print(json.dumps({'folder': str(root), 'sources': len(entries), 'png_exports': len(entries) * len(SIZES), 'sheets': ['contact-sheet.png', 'small-sizes.png']}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('folder', type=Path)
    prepare(parser.parse_args().folder.resolve())
