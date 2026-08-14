from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "deliverables" / "v012-art-production" / "production" / "icon-batch-b-v1"

ASSETS = [
    (
        "icon_spirit_ore",
        "灵矿",
        OUT / "icon_spirit_ore_qc" / "icon_spirit_ore_source-magenta" / "cutout.png",
        78,
    ),
    (
        "icon_azure_edge_sword",
        "青锋剑",
        OUT / "icon_azure_edge_sword_qc" / "icon_azure_edge_sword_source-magenta" / "cutout.png",
        82,
    ),
    (
        "icon_build_spirit_mine",
        "灵矿场",
        ROOT / "deliverables" / "v012-art-production" / "production" / "runtime-core-v3" / "bldg_spirit_mine_iso.png",
        84,
    ),
    (
        "icon_build_artifact_forge",
        "炼器坊",
        ROOT / "deliverables" / "v012-art-production" / "production" / "runtime-core-v3" / "bldg_artifact_forge_iso_idle.png",
        84,
    ),
    (
        "icon_build_artifact_shop",
        "法器铺",
        ROOT / "deliverables" / "v012-art-production" / "production" / "runtime-core-v3" / "bldg_artifact_shop_iso.png",
        84,
    ),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"),
        Path("C:/Windows/Fonts/simhei.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    bbox = image.getchannel("A").getbbox()
    if bbox is None:
        raise ValueError("empty alpha image")
    return bbox


def normalize(source: Path, target: Path, visible_size: int) -> dict:
    image = Image.open(source).convert("RGBA")
    bbox = alpha_bbox(image)
    subject = image.crop(bbox)
    scale = min(visible_size / subject.width, visible_size / subject.height)
    width = max(1, round(subject.width * scale))
    height = max(1, round(subject.height * scale))
    subject = subject.resize((width, height), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    x = (96 - width) // 2
    y = 92 - height
    canvas.alpha_composite(subject, (x, y))
    canvas.save(target)
    corners = [canvas.getpixel((0, 0))[3], canvas.getpixel((95, 0))[3], canvas.getpixel((0, 95))[3], canvas.getpixel((95, 95))[3]]
    return {
        "source": str(source.relative_to(ROOT)),
        "runtime": str(target.relative_to(ROOT)),
        "canvas": [96, 96],
        "alphaBounds": list(alpha_bbox(canvas)),
        "transparentCorners": corners,
    }


def checker(size: tuple[int, int], block: int = 8) -> Image.Image:
    out = Image.new("RGB", size, "white")
    draw = ImageDraw.Draw(out)
    for y in range(0, size[1], block):
        for x in range(0, size[0], block):
            color = "#d5d5d5" if (x // block + y // block) % 2 == 0 else "#f0f0f0"
            draw.rectangle((x, y, x + block - 1, y + block - 1), fill=color)
    return out


def build_sheet(items: list[tuple[str, str, Path, int]]) -> None:
    width, height = 1220, 350
    sheet = Image.new("RGB", (width, height), "#efe4c8")
    draw = ImageDraw.Draw(sheet)
    title_font = font(26, True)
    label_font = font(22, True)
    note_font = font(15)
    draw.rectangle((5, 5, width - 6, height - 6), outline="#6b4a26", width=4)
    draw.text((24, 17), "v0.12 第二生产链·资源与建造图标", fill="#302217", font=title_font)
    draw.text((24, 55), "96×96透明PNG｜左侧为图标原尺寸展示，右下角为底栏实际缩略尺寸", fill="#6b533c", font=note_font)
    card_w = 224
    for index, (_, label, _, _) in enumerate(items):
        x0 = 20 + index * 238
        y0 = 87
        draw.rounded_rectangle((x0, y0, x0 + card_w, 325), radius=5, fill="#fff3cf", outline="#8a5d2b", width=3)
        draw.text((x0 + 14, y0 + 12), label, fill="#332419", font=label_font)
        bg = checker((128, 128))
        sheet.paste(bg, (x0 + 14, y0 + 54))
        icon = Image.open(OUT / f"{items[index][0]}.png").convert("RGBA")
        sheet.paste(icon, (x0 + 30, y0 + 70), icon)
        draw.rectangle((x0 + 158, y0 + 113, x0 + 210, y0 + 165), fill="#f7d37b", outline="#a86b21", width=2)
        tiny = icon.resize((48, 48), Image.Resampling.LANCZOS)
        sheet.paste(tiny, (x0 + 160, y0 + 115), tiny)
        draw.text((x0 + 14, y0 + 194), "实机48px", fill="#71563a", font=note_font)
    sheet.save(OUT / "icon-batch-b-contact-sheet.png")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {"status": "pending-user-approval", "batch": "B", "assets": {}}
    for slug, _, source, visible_size in ASSETS:
        target = OUT / f"{slug}.png"
        manifest["assets"][slug] = normalize(source, target, visible_size)
    build_sheet(ASSETS)
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
