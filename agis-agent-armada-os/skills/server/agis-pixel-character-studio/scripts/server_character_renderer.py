#!/usr/bin/env python3
"""Hardened deterministic AGIS pixel-character renderer (Pillow only)."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
from dataclasses import asdict, dataclass
from pathlib import Path

from PIL import Image, ImageDraw

HEX = re.compile(r"^#[0-9a-fA-F]{6}$")
SLUG = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")
ALLOWED_CANVAS = {32, 48, 64, 96, 128}
ALLOWED_ACCESSORIES = {"none", "crown", "compass", "book", "hammer", "cross", "sword", "pan", "target", "clone"}
ALLOWED_EXPRESSIONS = {"calm", "happy", "focused", "alert"}
ALLOWED_ANIMATIONS = {"static", "idle"}
MAX_PALETTE = 16


@dataclass(frozen=True)
class CharacterSpec:
    slug: str
    name: str
    role: str
    primary: str = "#1f6feb"
    secondary: str = "#d6a744"
    skin: str = "#d8a47f"
    hair: str = "#172033"
    ink: str = "#0b1220"
    canvas: int = 64
    accessory: str = "none"
    expression: str = "focused"
    animation: str = "idle"

    def validate(self) -> None:
        if not SLUG.fullmatch(self.slug):
            raise ValueError("invalid slug")
        if not (1 <= len(self.name.strip()) <= 80):
            raise ValueError("invalid name")
        if not (1 <= len(self.role.strip()) <= 120):
            raise ValueError("invalid role")
        for key in ("primary", "secondary", "skin", "hair", "ink"):
            if not HEX.fullmatch(getattr(self, key)):
                raise ValueError(f"invalid color: {key}")
        if self.canvas not in ALLOWED_CANVAS:
            raise ValueError("canvas not allowed")
        if self.accessory not in ALLOWED_ACCESSORIES:
            raise ValueError("accessory not allowed")
        if self.expression not in ALLOWED_EXPRESSIONS:
            raise ValueError("expression not allowed")
        if self.animation not in ALLOWED_ANIMATIONS:
            raise ValueError("animation not allowed")


def rgb(value: str) -> tuple[int, int, int, int]:
    return tuple(int(value[i:i + 2], 16) for i in (1, 3, 5)) + (255,)


def shade(value: str, factor: float) -> str:
    r, g, b, _ = rgb(value)
    return "#%02x%02x%02x" % tuple(max(0, min(255, round(v * factor))) for v in (r, g, b))


def safe_output_dir(root: Path, slug: str) -> Path:
    root = root.resolve()
    out = (root / slug).resolve()
    if root != out and root not in out.parents:
        raise ValueError("output path escaped root")
    out.mkdir(parents=True, exist_ok=True)
    return out


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def draw_accessory(draw: ImageDraw.ImageDraw, spec: CharacterSpec, cx: int, top: int, u: int) -> None:
    gold, ink = rgb(spec.secondary), rgb(spec.ink)
    if spec.accessory == "none":
        return
    if spec.accessory == "crown":
        draw.line((cx - 7*u, top + 2*u, cx + 7*u, top + 2*u), fill=ink, width=u)
        draw.line((cx - 6*u, top + 1*u, cx - 6*u, top - 4*u, cx, top, cx + 6*u, top - 4*u, cx + 6*u, top + 1*u), fill=gold, width=u)
    elif spec.accessory == "compass":
        draw.ellipse((cx + 8*u, top + 16*u, cx + 16*u, top + 24*u), fill=ink)
        draw.ellipse((cx + 9*u, top + 17*u, cx + 15*u, top + 23*u), fill=gold)
        draw.line((cx + 12*u, top + 17*u, cx + 12*u, top + 23*u), fill=ink, width=u)
    elif spec.accessory == "book":
        draw.rectangle((cx + 8*u, top + 18*u, cx + 16*u, top + 27*u), fill=ink)
        draw.rectangle((cx + 9*u, top + 19*u, cx + 15*u, top + 26*u), fill=gold)
        draw.line((cx + 12*u, top + 19*u, cx + 12*u, top + 26*u), fill=ink, width=u)
    elif spec.accessory == "hammer":
        draw.rectangle((cx + 10*u, top + 14*u, cx + 12*u, top + 29*u), fill=gold)
        draw.rectangle((cx + 6*u, top + 12*u, cx + 16*u, top + 17*u), fill=ink)
    elif spec.accessory == "cross":
        draw.rectangle((cx + 10*u, top + 16*u, cx + 14*u, top + 28*u), fill=gold)
        draw.rectangle((cx + 6*u, top + 20*u, cx + 18*u, top + 24*u), fill=gold)
    elif spec.accessory == "sword":
        draw.line((cx + 8*u, top + 12*u, cx + 17*u, top + 31*u), fill=ink, width=2*u)
        draw.line((cx + 9*u, top + 12*u, cx + 17*u, top + 29*u), fill=gold, width=u)
        draw.line((cx + 7*u, top + 24*u, cx + 14*u, top + 21*u), fill=ink, width=2*u)
    elif spec.accessory == "pan":
        draw.ellipse((cx + 7*u, top + 17*u, cx + 17*u, top + 27*u), fill=ink)
        draw.ellipse((cx + 9*u, top + 19*u, cx + 15*u, top + 25*u), fill=gold)
        draw.line((cx + 16*u, top + 25*u, cx + 21*u, top + 30*u), fill=ink, width=2*u)
    elif spec.accessory == "target":
        draw.ellipse((cx + 7*u, top + 16*u, cx + 17*u, top + 26*u), fill=ink)
        draw.ellipse((cx + 9*u, top + 18*u, cx + 15*u, top + 24*u), fill=gold)
        draw.ellipse((cx + 11*u, top + 20*u, cx + 13*u, top + 22*u), fill=ink)
    elif spec.accessory == "clone":
        draw.ellipse((cx + 6*u, top + 15*u, cx + 16*u, top + 25*u), outline=gold, width=u)
        draw.ellipse((cx + 9*u, top + 18*u, cx + 19*u, top + 28*u), outline=ink, width=u)


def render_frame(spec: CharacterSpec, bob: int) -> Image.Image:
    n = spec.canvas
    u = max(1, n // 64)
    cx = n // 2
    top = 8*u + bob
    image = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)
    ink = rgb(spec.ink)
    primary_dark = rgb(shade(spec.primary, 0.65))
    primary = rgb(spec.primary)
    primary_light = rgb(shade(spec.primary, 1.18))
    skin = rgb(spec.skin)
    skin_shadow = rgb(shade(spec.skin, 0.82))
    hair = rgb(spec.hair)
    gold = rgb(spec.secondary)

    d.ellipse((cx - 12*u, top + 43*u, cx + 12*u, top + 48*u), fill=(16, 24, 39, 255))
    d.rectangle((cx - 11*u, top + 27*u, cx + 11*u, top + 43*u), fill=primary_dark)
    d.rectangle((cx - 9*u, top + 27*u, cx + 9*u, top + 40*u), fill=primary)
    d.rectangle((cx - 7*u, top + 28*u, cx + 7*u, top + 34*u), fill=primary_light)
    d.rectangle((cx - 2*u, top + 28*u, cx + 2*u, top + 40*u), fill=gold)
    d.rectangle((cx - 14*u, top + 29*u, cx - 10*u, top + 41*u), fill=primary_dark)
    d.rectangle((cx + 10*u, top + 29*u, cx + 14*u, top + 41*u), fill=primary_dark)
    d.rectangle((cx - 9*u, top + 41*u, cx - 2*u, top + 48*u), fill=ink)
    d.rectangle((cx + 2*u, top + 41*u, cx + 9*u, top + 48*u), fill=ink)

    d.ellipse((cx - 10*u, top + 5*u, cx + 10*u, top + 28*u), fill=ink)
    d.ellipse((cx - 9*u, top + 6*u, cx + 9*u, top + 27*u), fill=skin)
    d.rectangle((cx - 9*u, top + 22*u, cx + 9*u, top + 27*u), fill=skin_shadow)
    d.rectangle((cx - 9*u, top + 5*u, cx + 9*u, top + 11*u), fill=hair)
    d.rectangle((cx - 10*u, top + 8*u, cx - 7*u, top + 19*u), fill=hair)
    d.rectangle((cx + 7*u, top + 8*u, cx + 10*u, top + 19*u), fill=hair)

    eye_y = top + 17*u
    if spec.expression == "happy":
        d.line((cx - 5*u, eye_y, cx - 2*u, eye_y + u), fill=ink, width=u)
        d.line((cx + 2*u, eye_y + u, cx + 5*u, eye_y), fill=ink, width=u)
        d.line((cx - 2*u, eye_y + 6*u, cx + 2*u, eye_y + 7*u), fill=ink, width=u)
    else:
        d.rectangle((cx - 5*u, eye_y, cx - 3*u, eye_y + 2*u), fill=ink)
        d.rectangle((cx + 3*u, eye_y, cx + 5*u, eye_y + 2*u), fill=ink)
        if spec.expression == "alert":
            d.line((cx - 6*u, eye_y - 2*u, cx - 3*u, eye_y - 3*u), fill=ink, width=u)
            d.line((cx + 3*u, eye_y - 3*u, cx + 6*u, eye_y - 2*u), fill=ink, width=u)
        elif spec.expression == "focused":
            d.line((cx - 6*u, eye_y - 3*u, cx - 3*u, eye_y - 2*u), fill=ink, width=u)
            d.line((cx + 3*u, eye_y - 2*u, cx + 6*u, eye_y - 3*u), fill=ink, width=u)
        d.line((cx - 2*u, eye_y + 6*u, cx + 2*u, eye_y + 6*u), fill=ink, width=u)

    draw_accessory(d, spec, cx, top, u)
    return image


def render(spec: CharacterSpec, root: Path) -> dict:
    spec.validate()
    out = safe_output_dir(root, spec.slug)
    colors = {spec.primary, shade(spec.primary, 0.65), shade(spec.primary, 1.18), spec.secondary, spec.skin, shade(spec.skin, 0.82), spec.hair, spec.ink, "#101827"}
    if len(colors) > MAX_PALETTE:
        raise ValueError("palette budget exceeded")

    offsets = [0] if spec.animation == "static" else [0, -1, 0, 1]
    durations = [180] if spec.animation == "static" else [180, 120, 180, 120]
    frames = [render_frame(spec, bob) for bob in offsets]

    base_png = out / f"{spec.slug}.png"
    frames[0].save(base_png)

    scale = max(2, 512 // spec.canvas)
    preview_frames = [f.resize((spec.canvas * scale, spec.canvas * scale), Image.Resampling.NEAREST) for f in frames]
    preview = out / "preview.png"
    if len(preview_frames) == 1:
        preview_frames[0].save(preview)
    else:
        sheet_preview = Image.new("RGBA", (preview_frames[0].width * len(preview_frames), preview_frames[0].height), (0, 0, 0, 0))
        for index, frame in enumerate(preview_frames):
            sheet_preview.paste(frame, (index * frame.width, 0), frame)
        sheet_preview.save(preview)

    files = [base_png, preview]
    if spec.animation == "idle":
        gif_path = out / f"{spec.slug}-idle.gif"
        frames[0].save(gif_path, save_all=True, append_images=frames[1:], duration=durations, loop=0, disposal=2, transparency=0)
        sheet_path = out / f"{spec.slug}-sheet.png"
        sheet = Image.new("RGBA", (spec.canvas * len(frames), spec.canvas), (0, 0, 0, 0))
        metadata = {"frames": [], "meta": {"size": {"w": sheet.width, "h": sheet.height}, "animation": "idle"}}
        for index, frame in enumerate(frames):
            x = index * spec.canvas
            sheet.paste(frame, (x, 0), frame)
            metadata["frames"].append({"index": index, "frame": {"x": x, "y": 0, "w": spec.canvas, "h": spec.canvas}, "duration": durations[index]})
        sheet.save(sheet_path)
        json_path = out / f"{spec.slug}-sheet.json"
        json_path.write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8")
        files.extend([gif_path, sheet_path, json_path])

    receipt = {
        "status": "PASS",
        "renderer": "agis-pixel-character-studio-server-v1",
        "spec": asdict(spec),
        "files": [{"path": p.name, "bytes": p.stat().st_size, "sha256": sha256(p)} for p in files],
        "palette": sorted(colors),
        "network_used": False,
        "subprocess_used": False,
        "dynamic_code_used": False,
        "external_input_used": False,
    }
    receipt_path = out / "receipt.json"
    receipt_path.write_text(json.dumps(receipt, ensure_ascii=False, indent=2), encoding="utf-8")
    return receipt


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--slug", required=True)
    ap.add_argument("--name", required=True)
    ap.add_argument("--role", required=True)
    ap.add_argument("--primary", default="#1f6feb")
    ap.add_argument("--secondary", default="#d6a744")
    ap.add_argument("--skin", default="#d8a47f")
    ap.add_argument("--hair", default="#172033")
    ap.add_argument("--ink", default="#0b1220")
    ap.add_argument("--canvas", type=int, default=64)
    ap.add_argument("--accessory", choices=sorted(ALLOWED_ACCESSORIES), default="none")
    ap.add_argument("--expression", choices=sorted(ALLOWED_EXPRESSIONS), default="focused")
    ap.add_argument("--animation", choices=sorted(ALLOWED_ANIMATIONS), default="idle")
    args = ap.parse_args()
    root = Path(os.environ.get("AGIS_PIXEL_OUTPUT_ROOT", "./outputs"))
    print(json.dumps(render(CharacterSpec(**vars(args)), root), ensure_ascii=False))


if __name__ == "__main__":
    main()
