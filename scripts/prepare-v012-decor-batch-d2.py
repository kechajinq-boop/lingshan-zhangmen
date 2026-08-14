from __future__ import annotations

import importlib.util
import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
BASE_SCRIPT = ROOT / "scripts" / "prepare-v012-decor-batch.py"
SPEC = importlib.util.spec_from_file_location("decor_d1_helpers", BASE_SCRIPT)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError(f"cannot load helpers: {BASE_SCRIPT}")
helpers = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(helpers)

PRODUCTION = ROOT / "deliverables" / "v012-art-production" / "production"
SOURCE_ROOT = PRODUCTION / "decor-batch-d2-v1"
OUTPUT = PRODUCTION / "decor-batch-d2-runtime-v1"
MAP_SOURCE = ROOT / "deliverables" / "v011-map-rebuild" / "equal-parcel" / "single-map-roads-3bridges-source.png"
CORE = PRODUCTION / "runtime-core-v3"

ASSETS = {
    "prop_spirit_fire_lantern": SOURCE_ROOT / "prop_spirit_fire_lantern" / "source-magenta" / "cutout.png",
    "prop_forge_banner": SOURCE_ROOT / "prop_forge_banner" / "source-magenta" / "cutout.png",
    "prop_shop_wan_yao_banner": SOURCE_ROOT / "prop_shop_wan_yao_banner" / "source-magenta" / "cutout.png",
    "prop_shop_wind_thunder_wings": SOURCE_ROOT / "prop_shop_wind_thunder_wings" / "source-magenta" / "cutout.png",
}

LIMITS = {
    "prop_spirit_fire_lantern": (128, 188),
    "prop_forge_banner": (128, 196),
    "prop_shop_wan_yao_banner": (142, 204),
    "prop_shop_wind_thunder_wings": (170, 186),
}

DISPLAY_WIDTHS = {
    "prop_spirit_fire_lantern": 44,
    "prop_forge_banner": 46,
    "prop_shop_wan_yao_banner": 52,
    "prop_shop_wind_thunder_wings": 66,
}


def configure_helpers() -> None:
    helpers.OUTPUT = OUTPUT
    helpers.LIMITS = LIMITS
    helpers.DISPLAY_WIDTHS = DISPLAY_WIDTHS


def build_contact_sheet(runtime: dict[str, Path]) -> None:
    labels = [
        ("灵火灯", "prop_spirit_fire_lantern"),
        ("炼器旗", "prop_forge_banner"),
        ("万妖幡", "prop_shop_wan_yao_banner"),
        ("风雷翅展台", "prop_shop_wind_thunder_wings"),
    ]
    cell_width, cell_height = 360, 460
    sheet = Image.new("RGB", (cell_width * 4, cell_height), "#efe7d0")
    draw = ImageDraw.Draw(sheet)
    for index, (label, key) in enumerate(labels):
        left = index * cell_width
        panel = helpers.checker((324, 330))
        sprite = helpers.fit(Image.open(runtime[key]).convert("RGBA"), 270, 275)
        panel.alpha_composite(sprite, ((panel.width - sprite.width) // 2, panel.height - sprite.height - 16))
        sheet.paste(panel.convert("RGB"), (left + 18, 70))
        draw.rectangle((left + 4, 4, left + cell_width - 5, cell_height - 5), outline="#6f4c24", width=3)
        draw.text((left + 20, 20), label, fill="#2b2014", font=helpers.font(25, bold=True))
        draw.text((left + 20, 415), "透明PNG｜1×1装饰位｜底部中心脚点", fill="#604a31", font=helpers.font(16))
    sheet.save(OUTPUT / "decor-batch-d2-contact-sheet.png")


def build_map_preview(runtime: dict[str, Path]) -> None:
    base = Image.open(MAP_SOURCE).convert("RGBA")
    forge = Image.open(CORE / "bldg_artifact_forge_iso_idle.png").convert("RGBA")
    shop = Image.open(CORE / "bldg_artifact_shop_iso.png").convert("RGBA")
    helpers.paste_at_anchor(base, forge, (495, 245), 116)
    helpers.paste_at_anchor(base, shop, (1265, 245), 116)
    anchors = {
        "prop_spirit_fire_lantern": (360, 285),
        "prop_forge_banner": (650, 285),
        "prop_shop_wan_yao_banner": (1110, 285),
        "prop_shop_wind_thunder_wings": (1425, 285),
    }
    for key, anchor in anchors.items():
        helpers.paste_at_anchor(
            base,
            Image.open(runtime[key]).convert("RGBA"),
            anchor,
            DISPLAY_WIDTHS[key],
        )
    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle((28, 24, 650, 122), radius=12, fill=(249, 239, 205, 235), outline="#6f4c24", width=3)
    draw.text((48, 38), "第二生产链装饰·第二批实机比例", fill="#2b2014", font=helpers.font(27, bold=True))
    draw.text((48, 82), "灵火灯｜炼器旗｜万妖幡｜风雷翅展台", fill="#5b3b1b", font=helpers.font(19))
    base.convert("RGB").save(OUTPUT / "decor-batch-d2-map-preview.jpg", quality=94)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    configure_helpers()
    runtime: dict[str, Path] = {}
    manifest: dict[str, dict] = {}
    for key, source in ASSETS.items():
        if not source.exists():
            raise FileNotFoundError(source)
        runtime[key], manifest[key] = helpers.normalize(key, source)
    build_contact_sheet(runtime)
    build_map_preview(runtime)
    (OUTPUT / "manifest.json").write_text(
        json.dumps(
            {"status": "pending-user-approval", "batch": "D2", "assets": manifest},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
