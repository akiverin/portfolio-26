"""Package generated concepts without changing their artwork. Requires Pillow."""
from pathlib import Path
import html
import json
import textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
data = json.loads((ROOT / 'manifest.json').read_text())
(ROOT / 'exports-4k').mkdir(exist_ok=True)
font_path = '/System/Library/Fonts/Supplemental/Arial.ttf'
bold_path = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
font = ImageFont.truetype(font_path, 24)
title_font = ImageFont.truetype(bold_path, 30)
large_font = ImageFont.truetype(bold_path, 44)
board = Image.new('RGB', (1760, 1970), '#071323')
draw = ImageDraw.Draw(board)
draw.text((40, 30), 'andkiv / ASCII CINEMA', font=large_font, fill='#F0F5FF')
draw.text((40, 92), '5 направлений · синий персонаж · тёплый свет', font=font, fill='#9BB9D6')
cards = []
for i, c in enumerate(data['concepts']):
    with Image.open(ROOT / c['image']) as source:
        source.load()
        c['sourceSize'] = list(source.size)
        c['exportSize'] = [3840, 2160]
        c['exportMethod'] = 'native' if source.size == (3840, 2160) else 'Lanczos upscale; non-native 4K'
        source.resize((3840, 2160), Image.Resampling.LANCZOS).save(ROOT / c['export'], optimize=True)
        preview = source.convert('RGB').resize((820, 461), Image.Resampling.LANCZOS)
    x, y = 40 + (i % 2) * 860, 155 + (i // 2) * 595
    board.paste(preview, (x, y))
    draw.text((x, y + 478), f'{i + 1:02} / {c["name"]}', font=title_font, fill='#FFA363')
    lines = textwrap.wrap(c['headline'].replace('\n', ' '), 53)
    for line_no, line in enumerate(lines):
        draw.text((x, y + 521 + 29 * line_no), line, font=font, fill='#E4ECF8')
    esc = lambda value: html.escape(str(value), quote=True)
    colors = ''.join(f'<span class="swatch" style="--color:{color}">{color}</span>' for color in c['palette'])
    cards.append(f'''<article id="concept-{i + 1}">
      <div class="label">{i + 1:02} / {esc(c['name'])}</div>
      <a href="{esc(c['export'])}" target="_blank" rel="noopener"><img src="{esc(c['image'])}" width="{c['sourceSize'][0]}" height="{c['sourceSize'][1]}" alt="{esc(c['name'])}: {esc(c['headline'].replace(chr(10), ' '))}" loading="lazy"></a>
      <div class="copy"><h2>{esc(c['headline']).replace(chr(10), '<br>')}</h2>
      <p>{esc(c['body'])}</p><div class="actions"><span>{esc(c['primary'])}</span><span>{esc(c['secondary'])}</span></div>
      <p class="scene">{esc(c['scene'])}</p><p class="motion"><b>Движение:</b> {esc(c['motion'])}</p>
      <div class="palette">{colors}</div>
      <p class="files"><a href="{esc(c['export'])}" download>Скачать PNG · 3840 × 2160</a><a href="{esc(c['image'])}" download>Оригинал · {c['sourceSize'][0]} × {c['sourceSize'][1]}</a></p>
      </div></article>''')

draw.text((900, 1400), 'Одна визуальная система.', font=title_font, fill='#F0F5FF')
draw.text((900, 1450), 'Пять разных историй.', font=title_font, fill='#FFA363')
for i, line in enumerate(['Имя — небольшая подпись.', 'Главный акцент — смысл работы.', 'ASCII-пейзаж разделён на планы', 'для будущего параллакса.', '', '3840 × 2160 — увеличенные экспорты.', 'Оригиналы сохранены отдельно.']):
    draw.text((900, 1520 + i * 34), line, font=font, fill='#9BB9D6')
board.save(ROOT / 'contact-sheet.jpg', quality=94, subsampling=0)
(ROOT / 'manifest.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
page = '''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>andkiv · ASCII cinema</title><style>
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#071323;color:#eff4fc;font:16px/1.6 Arial,sans-serif}main{max-width:1500px;margin:auto;padding:56px 28px}header{max-width:900px;margin-bottom:44px}h1{font-size:clamp(32px,5vw,64px);line-height:1.1;letter-spacing:-.04em;margin:12px 0 20px}header p{color:#a9bfd7}.eyebrow,.label{color:#ffa363;letter-spacing:.12em;font-size:13px;text-transform:uppercase}nav{display:flex;flex-wrap:wrap;gap:10px}a{color:#aaccff;text-underline-offset:4px}nav a{border:1px solid #314660;border-radius:30px;padding:8px 14px;text-decoration:none}article{border:1px solid #263951;border-radius:22px;overflow:hidden;margin:0 0 44px;background:#0a192b;scroll-margin-top:20px}.label{padding:18px 24px}img{display:block;width:100%;height:auto}.copy{padding:22px 28px 28px}h2{font-size:clamp(26px,3vw,42px);line-height:1.16;letter-spacing:-.025em;margin:0 0 16px}.copy>p{max-width:850px}.scene,.motion{color:#a9bfd7}.actions,.palette,.files{display:flex;flex-wrap:wrap;gap:14px}.actions span{border:1px solid #3d526d;border-radius:24px;padding:6px 16px;font-size:14px}.actions span:first-child{background:#ffa363;color:#132236;border-color:#ffa363}.swatch{display:flex;align-items:center;gap:7px;font:12px monospace}.swatch:before{content:'';width:20px;height:20px;border-radius:50%;background:var(--color);border:1px solid #ffffff33}.files{margin-bottom:0;font-size:14px}.notice{border-left:3px solid #ffa363;padding-left:16px}footer{color:#89a5c5;font-size:14px}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media(max-width:600px){main{padding:30px 12px}.copy{padding:18px}.label{padding:14px 18px}.files{flex-direction:column}}
</style><main><header><div class="eyebrow">andkiv · Hero exploration</div><h1>Пять историй<br>в синем и оранжевом.</h1><p>Развитие первого ASCII-концепта: разные фоны, заголовки и композиции. Персонаж синий во всех вариантах. Имя остаётся подписью.</p><p class="notice">Генератор вернул оригиналы меньше 4K. Файлы 3840 × 2160 подготовлены увеличением Lanczos; это не нативная 4K-генерация. Оригиналы доступны рядом. Параллакс описан как идея для следующего этапа.</p><nav>'''
page += ''.join(f'<a href="#concept-{i+1}">{i+1:02} / {html.escape(c["name"])}</a>' for i,c in enumerate(data['concepts']))
page += '</nav></header>' + ''.join(cards) + '<footer>Создано встроенным image_gen · <a href="prompts.md">Все промпты</a> · <a href="manifest.json">Тексты, палитры и параметры</a> · <a href="contact-sheet.jpg">Общий лист</a></footer></main></html>'
(ROOT / 'gallery.html').write_text(page)
print(json.dumps([{ 'id': c['id'], 'original': c['sourceSize'], 'export': c['exportSize'], 'method': c['exportMethod']} for c in data['concepts']], ensure_ascii=False, indent=2))
