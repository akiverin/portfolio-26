"""Build self-hosted Latin/Cyrillic variable webfonts. Requires fonttools[woff]."""
from pathlib import Path
from hashlib import sha256
from io import BytesIO
import json
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent
DEST = ROOT.parents[2] / 'src/shared/styles/fonts/Medeo'
DEST.mkdir(parents=True, exist_ok=True)
REVISION = 'a67da3062336585ebd9ab7a4553e0bad3a0cc64d'
RANGES = [(0x20, 0x24F), (0x300, 0x36F), (0x400, 0x52F), (0x1C80, 0x1C8F),
          (0x1E00, 0x1EFF), (0x2000, 0x206F), (0x20A0, 0x20CF), (0x2100, 0x214F),
          (0x2190, 0x21FF), (0x2200, 0x22FF), (0x25A0, 0x25FF), (0x2DE0, 0x2DFF),
          (0xA640, 0xA69F), (0xFE00, 0xFE0F), (0xFFFD, 0xFFFD)]
UNICODES = {c for start, end in RANGES for c in range(start, end + 1)}
manifest = {'repository': 'https://github.com/DNFDEVS/medeo-font', 'revision': REVISION,
            'license': 'SIL Open Font License 1.1', 'fontTools': __import__('fontTools').version,
            'modifications': 'Latin/Cyrillic web subsets; wght limited to 400–900; original opsz retained; no outlines redesigned.',
            'files': []}
for family in ('MedeoSansVariable', 'MedeoSansVariable-Italic', 'MedeoMonoVariable'):
    source = ROOT / 'source' / f'{family}.woff2'
    font = TTFont(source, recalcTimestamp=False)
    font = instantiateVariableFont(font, {'wght': (400, 900)}, inplace=True)
    # Normalize empty gvar entries after instancing before glyph subsetting.
    font.flavor = None
    intermediate = BytesIO()
    font.save(intermediate)
    intermediate.seek(0)
    font = TTFont(intermediate, recalcTimestamp=False)
    options = subset.Options()
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_languages = ['*']
    options.name_legacy = True
    options.recalc_timestamp = False
    options.notdef_glyph = True
    options.notdef_outline = True
    options.passthrough_tables = True
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=UNICODES)
    sub.subset(font)
    font.flavor = 'woff2'
    target = DEST / f'{family}-latin-cyrillic.woff2'
    font.save(target)
    rebuilt = TTFont(target)
    assert all(ord(c) in rebuilt.getBestCmap() for c in 'HelloПриветЁёЯя₽€—→'), target
    assert rebuilt['name'].getDebugName(13), 'License metadata must be preserved'
    record = {'file': target.name, 'sourceBytes': source.stat().st_size,
              'bytes': target.stat().st_size, 'sha256': sha256(target.read_bytes()).hexdigest(),
              'axes': {a.axisTag: [a.minValue, a.maxValue] for a in rebuilt['fvar'].axes}}
    manifest['files'].append(record)
    print(json.dumps(record, ensure_ascii=False))
(ROOT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
