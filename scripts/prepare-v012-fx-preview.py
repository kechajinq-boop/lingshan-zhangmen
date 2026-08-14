from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "deliverables" / "v012-art-production" / "production" / "fx-batch-c-v1"
CORE = ROOT / "deliverables" / "v012-art-production" / "production" / "runtime-core-v3"
MAP = ROOT / "deliverables" / "v011-map-rebuild" / "grounding" / "southeast-extension-v1" / "single-map-roads-3bridges-southeast-extended.png"

ITEMS = [
    ("fx_mine_spirit_glow", "灵矿采集灵光", CORE / "bldg_spirit_mine_iso.png", (0.38, 0.38), 180),
    ("fx_forge_flame_sparks", "炼器锻造火星", CORE / "bldg_artifact_forge_iso_idle.png", (0.43, 0.60), 110),
]


def font(size: int, bold: bool = False):
    path = Path("C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc")
    return ImageFont.truetype(str(path), size=size) if path.exists() else ImageFont.load_default()


def load_frames(slug: str) -> list[Image.Image]:
    folder = OUT / slug
    prefix = "impact" if "forge" in slug else "idle"
    return [Image.open(folder / f"{prefix}-{i}.png").convert("RGBA") for i in range(1, 5)]


def fit(image: Image.Image, width: int) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        return image
    subject = image.crop(bbox)
    scale = width / subject.width
    return subject.resize((width, max(1, round(subject.height * scale))), Image.Resampling.LANCZOS)


def compose_card(building_path: Path, effect: Image.Image, position: tuple[float, float]) -> Image.Image:
    card = Image.new("RGBA", (360, 280), (224, 235, 198, 255))
    building = fit(Image.open(building_path).convert("RGBA"), 190)
    bx = (card.width - building.width) // 2
    by = card.height - building.height - 20
    card.alpha_composite(building, (bx, by))
    fx = effect.resize((72, 72), Image.Resampling.NEAREST)
    x = bx + round(building.width * position[0]) - fx.width // 2
    y = by + round(building.height * position[1]) - fx.height // 2
    card.alpha_composite(fx, (x, y))
    return card


def main() -> None:
    frame_sets = {slug: load_frames(slug) for slug, *_ in ITEMS}
    title_h = 78
    sheet = Image.new("RGB", (1120, 390), "#efe4c8")
    draw = ImageDraw.Draw(sheet)
    draw.rectangle((4, 4, 1115, 385), outline="#6b4a26", width=4)
    draw.text((24, 16), "v0.12 第二生产链·工作状态特效", fill="#302217", font=font(27, True))
    draw.text((24, 52), "左：建筑实机叠加｜右：4帧循环逐帧预览", fill="#6b533c", font=font(15))
    for index, (slug, label, building, position, _) in enumerate(ITEMS):
        x0 = 18 + index * 368
        draw.rounded_rectangle((x0, title_h, x0 + 350, 368), radius=5, fill="#fff3cf", outline="#8a5d2b", width=3)
        draw.text((x0 + 14, title_h + 10), label, fill="#332419", font=font(21, True))
        card = compose_card(building, frame_sets[slug][2], position).convert("RGB").resize((238, 185), Image.Resampling.LANCZOS)
        sheet.paste(card, (x0 + 12, title_h + 50))
        for i, frame in enumerate(frame_sets[slug]):
            bg = Image.new("RGBA", (76, 76), (55, 65, 55, 255))
            preview = frame.resize((64, 64), Image.Resampling.NEAREST)
            bg.alpha_composite(preview, (6, 6))
            sheet.paste(bg.convert("RGB"), (x0 + 262, title_h + 50 + i * 54))

    # 法器铺保留静态陈列，明确不叠加任何工作特效。
    x0 = 18 + 2 * 368
    draw.rounded_rectangle((x0, title_h, x0 + 350, 368), radius=5, fill="#fff3cf", outline="#8a5d2b", width=3)
    draw.text((x0 + 14, title_h + 10), "法器铺静态陈列", fill="#332419", font=font(21, True))
    shop_card = Image.new("RGBA", (360, 280), (224, 235, 198, 255))
    shop = fit(Image.open(CORE / "bldg_artifact_shop_iso.png").convert("RGBA"), 190)
    shop_card.alpha_composite(shop, ((shop_card.width - shop.width) // 2, shop_card.height - shop.height - 20))
    sheet.paste(shop_card.convert("RGB").resize((238, 185), Image.Resampling.LANCZOS), (x0 + 12, title_h + 50))
    draw.rounded_rectangle((x0 + 262, title_h + 68, x0 + 338, title_h + 216), radius=6, fill="#374137")
    draw.text((x0 + 278, title_h + 94), "无", fill="#fff3cf", font=font(28, True))
    draw.text((x0 + 272, title_h + 133), "特效", fill="#fff3cf", font=font(23, True))
    draw.text((x0 + 266, title_h + 178), "不遮挡", fill="#d4efbd", font=font(14, True))
    sheet.save(OUT / "fx-batch-c-contact-sheet-v2.png")

    base = Image.open(MAP).convert("RGBA").resize((1536, 864), Image.Resampling.LANCZOS)
    placements = [(360, 260), (620, 260)]
    for (slug, _, building, position, _), (x, y) in zip(ITEMS, placements):
        b = fit(Image.open(building).convert("RGBA"), 150)
        base.alpha_composite(b, (x - b.width // 2, y - b.height))
        fx = frame_sets[slug][2].resize((80, 80), Image.Resampling.NEAREST)
        fx_x = x - b.width // 2 + round(b.width * position[0]) - 40
        fx_y = y - b.height + round(b.height * position[1]) - 40
        base.alpha_composite(fx, (fx_x, fx_y))

    shop = fit(Image.open(CORE / "bldg_artifact_shop_iso.png").convert("RGBA"), 150)
    base.alpha_composite(shop, (880 - shop.width // 2, 260 - shop.height))
    panel = Image.new("RGBA", (510, 86), (255, 243, 207, 236))
    pd = ImageDraw.Draw(panel)
    pd.rectangle((0, 0, 509, 85), outline="#6b4a26", width=3)
    pd.text((18, 12), "第二生产链·工作特效实机比例", fill="#302217", font=font(24, True))
    pd.text((18, 51), "灵矿灵光｜炼器火星（法器铺保持静态展示）", fill="#6b533c", font=font(16))
    base.alpha_composite(panel, (24, 20))
    base.convert("RGB").save(OUT / "fx-batch-c-map-preview-v2.jpg", quality=92)

    manifest = {"status": "pending-user-approval", "batch": "C", "assets": {}}
    for slug, label, _, position, duration in ITEMS:
        meta = json.loads((OUT / slug / "pipeline-meta.json").read_text(encoding="utf-8"))
        manifest["assets"][slug] = {
            "label": label,
            "sheet": str((OUT / slug / "sheet-transparent.png").relative_to(ROOT)),
            "gif": str((OUT / slug / "animation.gif").relative_to(ROOT)),
            "frames": 4,
            "durationMs": duration,
            "overlayPosition": list(position),
            "emptyFrames": meta["empty_frames"],
            "sourceEdgeTouchFrames": meta["source_edge_touch_frames"],
            "outputEdgeTouchFrames": meta["output_edge_touch_frames"],
            "pasteClampedFrames": meta["paste_clamped_frames"],
        }
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
