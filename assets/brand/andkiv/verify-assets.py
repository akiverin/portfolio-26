#!/usr/bin/env python3
"""Verify portable SVG exports and compare the mascot with the selected silhouette."""
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent

def main():
    files = sorted((ROOT/"svg").rglob("*.svg"))
    assert len(files)==30, f"Expected 30 SVGs, got {len(files)}"
    for path in files:
        text=path.read_text()
        tree=ET.fromstring(text)
        elements=list(tree.iter())
        names=[e.tag.rsplit("}",1)[-1] for e in elements]
        assert not set(names)&{"image","text","foreignObject","script"}, path
        ids=[e.attrib["id"] for e in elements if "id" in e.attrib]
        assert len(ids)==len(set(ids)), f"Duplicate IDs in {path}"
        for ref in re.findall(r"url\(#([^)]+)\)",text):
            assert ref in ids, (path,ref)
        for e in elements:
            for attr,value in e.attrib.items():
                if attr.rsplit("}",1)[-1]=="href":
                    assert value.startswith("#"), (path,value)
        if path.stem!="sprite":
            assert tree.attrib.get("viewBox"), path
            assert "title" in names and "desc" in names, path

    master=ET.parse(ROOT/"svg/mascot/mascot.svg")
    ids={e.attrib.get("id") for e in master.iter()}
    assert {"body","eye-left","eye-right"}<=ids
    manifest=json.loads((ROOT/"manifest.json").read_text())
    png_count=0
    ico_count=0
    for icon in manifest["icons"]:
        assert (ROOT/icon["svg"]).exists()
        for size in icon["sizes"]:
            path=ROOT/icon["pngFolder"]/f"{size}.png"
            with Image.open(path) as im:
                assert im.size==(size,size), path
                assert im.mode=="RGBA", path
                assert im.getpixel((0,0))[3]==0, path
                im.load()
            png_count+=1
        with Image.open(ROOT/icon["pngFolder"]/"favicon.ico") as im:
            assert {(16,16),(32,32),(48,48)}<=im.ico.sizes()
        ico_count+=1
    for logo in manifest["logos"]:
        for path in logo["files"].values():
            assert (ROOT/path).exists()
        for theme in ("light","dark","mono"):
            with Image.open(ROOT/f'previews/logos/{logo["id"]}-{theme}.png') as im:
                assert im.mode=="RGBA"
                assert im.getbbox() is not None
                im.load()

    geometry=json.loads((ROOT/"source/geometry.json").read_text())
    assert geometry["bodyPath"].count("C")==17
    source=np.asarray(Image.open(ROOT/geometry["source"]).convert("RGB"),dtype=float)
    r,g,b=source[:,:,0],source[:,:,1],source[:,:,2]
    labels,_=ndimage.label((r>190)&(g>140)&(r>g+15)&(g>b+15))
    mask=labels==(np.bincount(labels.ravel())[1:].argmax()+1)
    scale=448/832
    tx,ty=32-203*scale,36-232*scale
    source_mask=Image.fromarray((mask*255).astype("uint8"))
    expected=np.asarray(source_mask.transform((512,512),Image.Transform.AFFINE,
        (1/scale,0,-tx/scale,0,1/scale,-ty/scale),resample=Image.Resampling.BILINEAR))>127
    rendered=Image.open(ROOT/"previews/mascot/mascot-ink.png").getchannel("A")
    actual=np.asarray(rendered.resize((512,512),Image.Resampling.LANCZOS))>127
    iou=float((expected&actual).sum()/(expected|actual).sum())
    assert iou>0.98, f"Silhouette overlap is too low: {iou:.4%}"
    report={"svgFiles":len(files),"embeddedRasters":0,"textNodes":0,"externalFontReferences":0,
            "duplicateIds":0,"pngIcons":png_count,"icoFiles":ico_count,
            "logoDirections":len(manifest["logos"]),"logoVersions":sum(len(v["files"]) for v in manifest["logos"]),
            "silhouetteIntersectionOverUnion":round(iou,6),"bodyCubicSegments":17,
            "note":"IoU compares the thresholded selected raster silhouette, including eye cutouts, with the rendered canonical monochrome SVG."}
    (ROOT/"source/validation.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
    print(json.dumps(report,ensure_ascii=False))

if __name__=="__main__":
    main()

