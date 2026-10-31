"""Package the five ImageGen concepts. Only resizes previews; preserves originals."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json
import html
import textwrap

root = Path(__file__).resolve().parent
manifest = json.loads((root / 'manifest.json').read_text())
regular = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 24)
bold = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 30)
large = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 44)
board = Image.new('RGB', (1760, 2120), '#071725')
draw = ImageDraw.Draw(board)
draw.text((40, 30), 'andkiv / ОБО МНЕ', font=large, fill='#EDF5FF')
draw.text((40, 92), '5 направлений · единая палитра с Hero · личная история', font=regular, fill='#A6BED6')
cards = []
for i, c in enumerate(manifest['concepts']):
    with Image.open(root / c['image']) as image:
        c['size'] = list(image.size)
        image.verify()
    with Image.open(root / c['image']) as image:
        preview = image.convert('RGB').resize((820, 513), Image.Resampling.LANCZOS)
    x, y = 40 + (i % 2) * 860, 155 + (i // 2) * 640
    board.paste(preview, (x, y))
    draw.text((x, y + 530), f'{i+1:02} / {c["name"]}', font=bold, fill='#FFB578')
    for n, line in enumerate(textwrap.wrap(c['headline'].replace('\n', ' '), 49)):
        draw.text((x, y + 574 + n * 29), line, font=regular, fill='#DCEAF8')
    e = html.escape
    cards.append(f'''<article id="concept-{i+1}"><div class="index">{i+1:02} / {e(c['name'])}</div>
      <a href="{e(c['image'])}" target="_blank" rel="noopener"><img src="{e(c['image'])}" alt="{e(c['name'])}: {e(c['headline'].replace(chr(10), ' '))}" width="{c['size'][0]}" height="{c['size'][1]}" loading="lazy"></a>
      <div class="copy"><h2>{e(c['headline']).replace(chr(10), '<br>')}</h2><p>{e(c['idea'])}</p>
      <dl><dt>Переход из Hero</dt><dd>{e(c['transition'])}</dd><dt>Идея движения</dt><dd>{e(c['motion'])}</dd></dl>
      <a class="download" href="{e(c['image'])}" download>Скачать оригинал PNG · {c['size'][0]} × {c['size'][1]}</a></div></article>''')

draw.text((900, 1490), 'Разные композиции.', font=bold, fill='#EDF5FF')
draw.text((900, 1540), 'Один визуальный мир.', font=bold, fill='#FFB578')
for i, line in enumerate(['Настоящая фотография.', 'Голубой ASCII-маскот.', 'Тёплый свет и холодные тени.', 'Живые цифры — как связующий мотив.', '', 'Пока это статические концепты.', 'Анимации описаны как следующий этап.']):
    draw.text((900, 1610 + i * 34), line, font=regular, fill='#A6BED6')
board.save(root / 'contact-sheet.jpg', quality=94, subsampling=0)
(root / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
page = '''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>andkiv · Обо мне · 5 концептов</title><style>
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#071725;color:#edf5ff;font:16px/1.6 Arial,sans-serif}main{max-width:1540px;margin:auto;padding:56px 28px}header{max-width:1040px;margin-bottom:44px}h1{font-size:clamp(34px,5vw,66px);line-height:1.08;letter-spacing:-.04em;margin:12px 0 24px}header p{color:#a6bed6}a{color:#b7d8ff;text-underline-offset:4px}.eyebrow,.index{color:#ffb578;letter-spacing:.1em;font-size:13px;text-transform:uppercase}nav{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}nav a{border:1px solid #304860;border-radius:24px;padding:8px 14px;text-decoration:none}.index{padding:18px 26px}article{border:1px solid #304158;border-radius:22px;overflow:hidden;background:#0b1e31;margin-bottom:46px;scroll-margin-top:20px}img{display:block;width:100%;height:auto}.copy{padding:24px 28px 30px}h2{font-size:clamp(26px,3vw,42px);line-height:1.16;letter-spacing:-.025em;margin:0 0 18px}.copy p{max-width:900px;color:#c5d7e9}dl{display:grid;grid-template-columns:180px 1fr;gap:12px 20px;max-width:1100px;margin:24px 0}dt{color:#ffb578;font-size:14px}dd{margin:0;color:#a6bed6}.download{font-size:14px}footer{color:#8da8c2;font-size:14px}@media(max-width:640px){main{padding:32px 12px}.copy{padding:20px}dl{grid-template-columns:1fr;gap:5px}dd{margin-bottom:14px}.index{padding:16px 20px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style><main><header><div class="eyebrow">andkiv · Design exploration / 01</div><h1>Обо мне.<br>Пять способов познакомиться.</h1><p>Продолжение Hero «Ясный проход»: кинематографическая сине-оранжевая палитра, ASCII-фактура, настоящий портрет и голубой маскот. Для каждого направления — своя композиция и идея перехода при прокрутке.</p><p>Это статические дизайн-концепты. Рабочая секция сайта не изменена; мелкий текст и детали макетов уточняются при реализации по данным сайта.</p><nav>'''
page += ''.join(f'<a href="#concept-{i+1}">{i+1:02} / {html.escape(c["name"])}</a>' for i,c in enumerate(manifest['concepts']))
page += '</nav></header>' + ''.join(cards) + '<footer>Создано встроенным image_gen · <a href="prompts.md">Полные промпты</a> · <a href="manifest.json">Идеи и параметры</a> · <a href="contact-sheet.jpg">Общий лист</a></footer></main></html>'
(root / 'gallery.html').write_text(page)
print(json.dumps([{'id':c['id'], 'size':c['size']} for c in manifest['concepts']], ensure_ascii=False))
