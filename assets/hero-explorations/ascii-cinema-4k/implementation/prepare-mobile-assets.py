"""Encode the portrait generated plate and matched technical depth texture."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

ROOT=Path(__file__).resolve().parent
OUT=ROOT.parents[3]/'src/assets/hero'
plate=Image.open(ROOT/'clear-passage-mobile-source.png').convert('RGB')
plate.save(OUT/'clear-passage-mobile.webp', quality=86, method=6)
w,h=plate.size

# Opening outline measured against the dedicated portrait source.
opening=[(.289,0),(.269,.012),(.237,.028),(.215,.046),(.180,.057),
(.146,.080),(.103,.108),(.074,.129),(.068,.157),(.066,.183),
(.075,.204),(.063,.229),(.046,.251),(.040,.277),(.047,.302),
(.037,.329),(.030,.356),(.045,.381),(.038,.408),(.034,.430),
(.039,.459),(.036,.487),(.026,.508),(.036,.533),(.033,.557),
(.035,.586),(.041,.615),(.044,.630),(.125,.628),(.195,.635),
(.225,.649),(.234,.681),(.239,.717),(.252,.746),(.277,.772),
(.312,.786),(.329,.808),(.376,.820),(.415,.839),(.452,.865),
(.498,.885),(.538,.889),(.579,.915),(.615,.937),(.666,.956),
(.711,.968),(.748,.975),(.788,.962),(.830,.953),(.861,.925),
(.900,.909),(.925,.877),(.945,.844),(.957,.815),(.959,.775),
(.967,.746),(.976,.720),(.976,.685),(.980,.655),(.987,.625),
(.993,.602),(.992,.570),(.992,.540),(.996,.515),(.999,.477),
(.988,.455),(.988,.434),(.997,.414),(.994,.391),(.990,.369),
(.980,.341),(.980,.318),(.967,.298),(.957,.278),(.953,.250),
(.965,.232),(.966,.214),(.956,.194),(.951,.170),(.941,.144),
(.918,.125),(.890,.112),(.861,.092),(.832,.082),(.805,.064),
(.777,.058),(.748,.061),(.715,.064),(.683,.053),(.646,.034),
(.618,.023),(.588,.008),(.550,0)]
near=Image.new('L',(w,h),255)
ImageDraw.Draw(near).polygon([(round(x*w),round(y*h)) for x,y in opening], fill=0)
near=near.filter(ImageFilter.GaussianBlur(3))
yy,xx=np.mgrid[0:h,0:w]
yn=yy/h
xn=xx/w
sea=np.where(yn>=.723,.16+np.clip((yn-.723)/.277,0,1)*.34,0)
mid=Image.new('L',(w,h),0)
md=ImageDraw.Draw(mid)
md.polygon([(round(x*w),round(y*h)) for x,y in [(.235,.750),(.244,.701),(.281,.688),(.309,.690),(.343,.717),(.378,.744),(.453,.755)]],fill=79)
md.polygon([(round(x*w),round(y*h)) for x,y in [(.783,.752),(.812,.715),(.848,.704),(.872,.699),(.903,.687),(.930,.690),(.976,.738)]],fill=79)
mid=mid.filter(ImageFilter.GaussianBlur(3))
background=np.maximum(sea*255,np.asarray(mid,dtype=np.float64))
a=np.asarray(near,dtype=np.float64)/255
strength=.88+.12*np.clip(np.maximum(np.abs(xn-.5)*2,yn),0,1)
depth=np.clip(a*255*strength+(1-a)*background,0,255).astype('uint8')
depth_img=Image.fromarray(depth)
depth_img.save(OUT/'clear-passage-mobile-depth.webp',lossless=True,method=6)
depth_img.save(ROOT/'clear-passage-mobile-depth-preview.png')
for filename in ['clear-passage-mobile.webp','clear-passage-mobile-depth.webp']:
    with Image.open(OUT/filename) as im:
        assert im.size==(w,h)
        im.verify()
    print(filename,(w,h),(OUT/filename).stat().st_size)
