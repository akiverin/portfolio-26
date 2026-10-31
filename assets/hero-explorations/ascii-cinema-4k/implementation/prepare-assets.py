"""Encode generated plate and build the technical (not illustrative) depth map."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parents[3]
OUT = PROJECT / 'src/assets/hero'
OUT.mkdir(parents=True, exist_ok=True)
plate = Image.open(ROOT / 'clear-passage-source.png').convert('RGB')
plate.save(OUT / 'clear-passage.webp', quality=86, method=6)
w, h = plate.size

# Clockwise trace of the open sky+sea; the outer frame remains nearest rock.
# Coordinates were matched to the generated source, not the original UI mockup.
opening = [
    (.400, 0), (.390, .027), (.353, .054), (.346, .095),
    (.326, .116), (.315, .163), (.290, .196), (.281, .236),
    (.260, .260), (.238, .304), (.224, .333), (.229, .379),
    (.245, .426), (.244, .471), (.265, .536), (.275, .591),
    (.320, .595), (.360, .607), (.390, .625), (.408, .651),
    (.415, .695), (.420, .751), (.442, .794), (.489, .822),
    (.520, .856), (.566, .886), (.613, .909), (.648, .952),
    (.695, .988), (.729, .986), (.763, .959), (.800, .937),
    (.831, .918), (.853, .890), (.880, .866), (.906, .849),
    (.922, .831), (.923, .780), (.931, .718), (.939, .668),
    (.957, .623), (.962, .578), (.970, .528), (.963, .479),
    (.966, .442), (.946, .411), (.920, .397), (.900, .367),
    (.881, .334), (.862, .310), (.856, .281), (.829, .266),
    (.811, .236), (.788, .220), (.770, .184), (.741, .172),
    (.729, .136), (.712, .102), (.695, .100), (.674, .116),
    (.648, .093), (.628, .069), (.603, .036), (.576, 0),
]
near = Image.new('L', (w, h), 255)
ImageDraw.Draw(near).polygon([(round(x*w), round(y*h)) for x,y in opening], fill=0)
near = near.filter(ImageFilter.GaussianBlur(4))
yy, xx = np.mgrid[0:h, 0:w]
yn = yy / h
xn = xx / w

# Distant sky stays black. Sea starts at the physical horizon and grows nearer.
sea = np.clip((yn - .764) / .236, 0, 1)
sea = np.where(yn >= .764, .16 + sea * .34, 0)
# Small distant coastal formations, intentionally much farther than cave walls.
mid = Image.new('L', (w, h), 0)
md = ImageDraw.Draw(mid)
md.polygon([(int(x*w), int(y*h)) for x,y in [(.420,.797),(.426,.719),(.446,.697),(.469,.714),(.490,.769),(.530,.812),(.565,.816),(.565,.839)]], fill=85)
md.polygon([(int(x*w), int(y*h)) for x,y in [(.789,.807),(.810,.779),(.830,.752),(.855,.751),(.874,.704),(.905,.669),(.934,.668),(.930,.812)]], fill=82)
mid = mid.filter(ImageFilter.GaussianBlur(3))
background = np.maximum(sea*255, np.asarray(mid, dtype=np.float64))
# Foreground gently graduates inward; no texture noise or flickering depth.
near_strength = .88 + .12*np.clip(np.maximum(np.abs(xn-.56)*2, yn), 0, 1)
a = np.asarray(near, dtype=np.float64)/255
depth = np.clip(a*255*near_strength+(1-a)*background,0,255).astype('uint8')
depth_image = Image.fromarray(depth)
depth_image.save(OUT/'clear-passage-depth.webp', lossless=True, method=6)
depth_image.save(ROOT/'clear-passage-depth-preview.png')
print(f'plate {plate.size}: {(OUT/"clear-passage.webp").stat().st_size:,} bytes')
print(f'depth: {(OUT/"clear-passage-depth.webp").stat().st_size:,} bytes')
