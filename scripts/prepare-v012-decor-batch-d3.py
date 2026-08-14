from __future__ import annotations

import importlib.util
import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
BASE_SCRIPT = ROOT / "scripts" / "prepare-v012-decor-batch.py"
SPEC = importlib.util.spec_from_file_location("decor_helpers", BASE_SCRIPT)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError(f"cannot load helpers: {BASE_SCRIPT}")
helpers = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(helpers)

PRODUCTION = ROOT / "deliverables" / "v012-art-production" / "production"
SOURCE_ROOT = PRODUCTION / "decor-batch-d3-v1"
OUTPUT = PRODUCTION / "decor-batch-d3-runtime-v1"
MAP_SOURCE = ROOT / "deliverables" / "v011-map-rebuild" / "equal-parcel" / "single-map-roads-3bridges-source.png"
CORE = PRODUCTION / "runtime-core-v3"

ASSETS = {
    "prop_quenching_trough": SOURCE_ROOT / "prop_quenching_trough" / "source-magenta" / "cutout.png",
    "prop_artifact_sword_case": SOURCE_ROOT / "prop_artifact_sword_case" / "source-magenta" / "cutout.png",
    "prop_suppression_stele": SOURCE_ROOT / "prop_suppression_stele" / "source-magenta" / "cutout.png",
    "prop_crane_standing": SOURCE_ROOT / "prop_crane_standing" / "source-magenta-longlegs-v2" / "cutout.png",
}

LIMITS = {
    "prop_quenching_trough": (178, 142),
    "prop_artifact_sword_case": (182, 138),
    "prop_suppression_stele": (122, 196),
    "prop_crane_standing": (112, 194),
}

DISPLAY_WIDTHS = {
    "prop_quenching_trough": 66,
    "prop_artifact_sword_case": 68,
    "prop_suppression_stele": 42,
    "prop_crane_standing": 36,
}


def strip_magenta_contamination(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, alpha = pixels[x, y]
            # D3 contains no intentional purple material. This removes the
            # pale and bright magenta fringe left around steam, shadows and
            # the crane sparkle while preserving cyan light and the red crown.
            if alpha and red > 72 and blue > 72 and min(red, blue) - green > 9:
                pixels[x, y] = (0, 0, 0, 0)
    return image


def remove_tiny_components(image: Image.Image, minimum: int = 28) -> Image.Image:
    image = image.convert("RGBA")
    width, height = image.size
    alpha = image.getchannel("A")
    seen: set[tuple[int, int]] = set()
    pixels = image.load()
    for y in range(height):
        for x in range(width):
            if (x, y) in seen or alpha.getpixel((x, y)) == 0:
                continue
            queue = deque([(x, y)])
            seen.add((x, y))
            component: list[tuple[int, int]] = []
            while queue:
                cx, cy = queue.popleft()
                component.append((cx, cy))
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in seen and alpha.getpixel((nx, ny)):
                        seen.add((nx, ny))
                        queue.append((nx, ny))
            if len(component) < minimum:
                for cx, cy in component:
                    pixels[cx, cy] = (0, 0, 0, 0)
    return image


def normalize(key: str, source: Path) -> tuple[Path, dict]:
    image = helpers.remove_connected_magenta(Image.open(source))
    image = helpers.harden_alpha(strip_magenta_contamination(image), 24)
    image = image.crop(helpers.alpha_bbox(image))
    max_width, max_height = LIMITS[key]
    scale = min(max_width / image.width, max_height / image.height)
    image = image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.Resampling.NEAREST,
    )
    image = helpers.harden_alpha(strip_magenta_contamination(image), 24)
    if key in {"prop_quenching_trough", "prop_crane_standing"}:
        image = remove_tiny_components(image)
    image = image.crop(helpers.alpha_bbox(image))
    canvas = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    left = 128 - image.width // 2
    top = 236 - image.height
    canvas.alpha_composite(image, (left, top))
    destination = OUTPUT / f"{key}.png"
    canvas.save(destination)
    return destination, {
        "canvas": [256, 256],
        "alphaBounds": list(helpers.alpha_bbox(canvas)),
        "anchor": [128, 236],
        "footprint": "1x1 decoration",
        "displayWidth": DISPLAY_WIDTHS[key],
        "source": str(source.relative_to(ROOT)),
    }


def build_contact_sheet(runtime: dict[str, Path]) -> None:
    labels = [
        ("淬火水槽", "prop_quenching_trough"),
        ("法器剑匣", "prop_artifact_sword_case"),
        ("镇器石碑", "prop_suppression_stele"),
        ("仙鹤", "prop_crane_standing"),
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
    sheet.save(OUTPUT / "decor-batch-d3-contact-sheet.png")


def build_map_preview(runtime: dict[str, Path]) -> None:
    base = Image.open(MAP_SOURCE).convert("RGBA")
    forge = Image.open(CORE / "bldg_artifact_forge_iso_idle.png").convert("RGBA")
    shop = Image.open(CORE / "bldg_artifact_shop_iso.png").convert("RGBA")
    helpers.paste_at_anchor(base, forge, (495, 245), 116)
    helpers.paste_at_anchor(base, shop, (1270, 245), 116)
    anchors = {
        "prop_quenching_trough": (335, 285),
        "prop_artifact_sword_case": (655, 285),
        "prop_suppression_stele": (1110, 285),
        "prop_crane_standing": (1435, 285),
    }
    for key, anchor in anchors.items():
        helpers.paste_at_anchor(base, Image.open(runtime[key]).convert("RGBA"), anchor, DISPLAY_WIDTHS[key])
    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle((28, 24, 665, 122), radius=12, fill=(249, 239, 205, 235), outline="#6f4c24", width=3)
    draw.text((48, 38), "第二生产链装饰·第三批实机比例", fill="#2b2014", font=helpers.font(27, bold=True))
    draw.text((48, 82), "淬火水槽｜法器剑匣｜镇器石碑｜仙鹤", fill="#5b3b1b", font=helpers.font(19))
    base.convert("RGB").save(OUTPUT / "decor-batch-d3-map-preview.jpg", quality=94)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    helpers.OUTPUT = OUTPUT
    helpers.LIMITS = LIMITS
    helpers.DISPLAY_WIDTHS = DISPLAY_WIDTHS
    runtime: dict[str, Path] = {}
    manifest: dict[str, dict] = {}
    for key, source in ASSETS.items():
        if not source.exists():
            raise FileNotFoundError(source)
        runtime[key], manifest[key] = normalize(key, source)
    build_contact_sheet(runtime)
    build_map_preview(runtime)
    (OUTPUT / "manifest.json").write_text(
        json.dumps({"status": "pending-user-approval", "batch": "D3", "assets": manifest}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
