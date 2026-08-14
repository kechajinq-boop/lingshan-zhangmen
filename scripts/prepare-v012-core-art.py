from __future__ import annotations

import hashlib
import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PRODUCTION = ROOT / "deliverables" / "v012-art-production" / "production"
OUTPUT = PRODUCTION / "runtime-core-v3"
MAP_SOURCE = (
    ROOT
    / "deliverables"
    / "v011-map-rebuild"
    / "equal-parcel"
    / "single-map-roads-3bridges-source.png"
)

ASSETS = {
    "bldg_spirit_mine_iso": PRODUCTION
    / "bldg_spirit_mine_iso_v1"
    / "source-magenta"
    / "cutout.png",
    "bldg_artifact_forge_iso_idle": PRODUCTION
    / "bldg_artifact_forge_iso_v1"
    / "source-magenta"
    / "cutout.png",
    "bldg_artifact_forge_iso_active_reference": PRODUCTION
    / "bldg_artifact_forge_iso_v1"
    / "source-active-magenta"
    / "cutout.png",
    "bldg_artifact_shop_iso": PRODUCTION
    / "bldg_artifact_shop_iso_v2"
    / "source-magenta"
    / "cutout.png",
    "fx_forge_da_geng_sword_array_active_7": PRODUCTION
    / "fx_forge_da_geng_sword_array_active_7_v4"
    / "source-magenta"
    / "cutout.png",
}


def preferred_cutout(source: Path) -> Path:
    clean = source.with_name("chroma-clean.png")
    # The helper's global despill changes warm wood into green; use it only for
    # the cyan effect layer, where the palette does not contain warm materials.
    if "fx_forge_da_geng" in str(source) and clean.exists():
        return clean
    return source

BUILDING_WIDTH = 430
BUILDING_HEIGHT_LIMIT = 440
CANVAS_SIZE = 512
ANCHOR = (256, 480)


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    box = alpha.getbbox()
    if not box:
        raise ValueError("asset has no visible pixels")
    return box


def dominant_bbox(source: Path, image: Image.Image, padding: int = 8) -> tuple[int, int, int, int]:
    report_path = source.with_name("report.json")
    if report_path.exists():
        report = json.loads(report_path.read_text(encoding="utf-8"))
        components = report.get("components") or []
        if components:
            component = max(components, key=lambda item: item.get("area", 0))
            left = max(0, int(component["x"]) - padding)
            top = max(0, int(component["y"]) - padding)
            right = min(image.width, int(component["x"] + component["width"]) + padding)
            bottom = min(image.height, int(component["y"] + component["height"]) + padding)
            return left, top, right, bottom
    return alpha_bbox(image)


def harden_alpha(image: Image.Image, threshold: int = 42) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            if a < threshold:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                pixels[x, y] = (r, g, b, 255)
    return image


def remove_edge_magenta(image: Image.Image) -> Image.Image:
    """Remove only chroma-like pixels connected to transparent exterior pixels."""
    image = image.convert("RGBA")
    width, height = image.size
    data = list(image.getdata())
    candidates = bytearray(width * height)
    transparent = bytearray(width * height)
    for index, (red, green, blue, alpha) in enumerate(data):
        transparent[index] = alpha < 12
        magenta_bias = min(red, blue) - green
        # AI chroma backgrounds vary in brightness. Require both channels to
        # be strongly magenta so natural purple plants and dark stone survive.
        if alpha and red > 210 and blue > 170 and green < 80 and magenta_bias > 105:
            data[index] = (0, 0, 0, 0)
            transparent[index] = 1
            continue
        if alpha and red > 55 and blue > 55 and green < 58 and magenta_bias > 44:
            candidates[index] = 1

    queue: deque[int] = deque()
    queued = bytearray(width * height)
    for index, is_candidate in enumerate(candidates):
        if not is_candidate:
            continue
        x, y = index % width, index // width
        neighbors = []
        if x:
            neighbors.append(index - 1)
        if x + 1 < width:
            neighbors.append(index + 1)
        if y:
            neighbors.append(index - width)
        if y + 1 < height:
            neighbors.append(index + width)
        if any(transparent[neighbor] for neighbor in neighbors):
            queue.append(index)
            queued[index] = 1

    while queue:
        index = queue.popleft()
        x, y = index % width, index // width
        for neighbor in (
            index - 1 if x else -1,
            index + 1 if x + 1 < width else -1,
            index - width if y else -1,
            index + width if y + 1 < height else -1,
        ):
            if neighbor >= 0 and candidates[neighbor] and not queued[neighbor]:
                queued[neighbor] = 1
                queue.append(neighbor)

    for index, remove in enumerate(queued):
        if remove:
            data[index] = (0, 0, 0, 0)
    image.putdata(data)
    return image


def normalize_building(source: Path, destination: Path) -> dict:
    image = harden_alpha(remove_edge_magenta(Image.open(source)))
    image = image.crop(dominant_bbox(source, image))
    scale = min(BUILDING_WIDTH / image.width, BUILDING_HEIGHT_LIMIT / image.height)
    resized = image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.Resampling.LANCZOS,
    )
    resized = harden_alpha(remove_edge_magenta(resized), 36)
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    left = ANCHOR[0] - resized.width // 2
    top = ANCHOR[1] - resized.height
    canvas.alpha_composite(resized, (left, top))
    canvas.save(destination)
    return {
        "source": str(source.relative_to(ROOT)).replace("\\", "/"),
        "runtime": str(destination.relative_to(ROOT)).replace("\\", "/"),
        "nativeSize": [CANVAS_SIZE, CANVAS_SIZE],
        "visualBounds": list(alpha_bbox(canvas)),
        "anchor": {"x": ANCHOR[0], "y": ANCHOR[1], "mode": "bottom-center"},
        "footprint": "2x2",
        "sha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
    }


def normalize_effect(source: Path, destination: Path) -> dict:
    image = remove_edge_magenta(Image.open(source).convert("RGBA"))
    # Detached swords and sparks are intentional parts of this effect; retain
    # the whole alpha extent rather than only the largest connected component.
    image = image.crop(alpha_bbox(image))
    scale = min(350 / image.width, 405 / image.height)
    resized = image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    left = CANVAS_SIZE // 2 - resized.width // 2
    top = 470 - resized.height
    canvas.alpha_composite(resized, (left, top))
    canvas.save(destination)
    return {
        "source": str(source.relative_to(ROOT)).replace("\\", "/"),
        "runtime": str(destination.relative_to(ROOT)).replace("\\", "/"),
        "nativeSize": [CANVAS_SIZE, CANVAS_SIZE],
        "visualBounds": list(alpha_bbox(canvas)),
        "anchor": {"x": 256, "y": 470, "mode": "effect-origin"},
        "swordCount": 7,
        "sha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
    }


def checker(size: tuple[int, int], step: int = 16) -> Image.Image:
    image = Image.new("RGBA", size, "#d9d9d9")
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], step):
        for x in range(0, size[0], step):
            if (x // step + y // step) % 2:
                draw.rectangle((x, y, x + step - 1, y + step - 1), fill="#f3f3f3")
    return image


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"),
        Path("C:/Windows/Fonts/simhei.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def crop_visible(image: Image.Image) -> Image.Image:
    return image.crop(alpha_bbox(image))


def fit_visible(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
    visible = crop_visible(image)
    scale = min(max_width / visible.width, max_height / visible.height)
    return visible.resize(
        (max(1, round(visible.width * scale)), max(1, round(visible.height * scale))),
        Image.Resampling.LANCZOS,
    )


def build_qc_sheet(runtime: dict[str, Path]) -> None:
    labels = [
        ("灵矿场", "bldg_spirit_mine_iso"),
        ("炼器坊·待机", "bldg_artifact_forge_iso_idle"),
        ("炼器坊·七剑工作态", "bldg_artifact_forge_iso_working_preview"),
        ("法器铺·万妖幡/风雷翅/兵器坛", "bldg_artifact_shop_iso"),
        ("独立大庚剑阵特效层（7柄）", "fx_forge_da_geng_sword_array_active_7"),
    ]
    cell_w, cell_h = 410, 560
    sheet = Image.new("RGB", (cell_w * len(labels), cell_h), "#efe7d0")
    draw = ImageDraw.Draw(sheet)
    title_font = font(25, bold=True)
    note_font = font(17)
    for index, (label, key) in enumerate(labels):
        left = index * cell_w
        panel = checker((cell_w - 24, 420), 18)
        sprite = Image.open(runtime[key]).convert("RGBA")
        sprite = fit_visible(sprite, 340, 370)
        panel.alpha_composite(
            sprite,
            ((panel.width - sprite.width) // 2, panel.height - sprite.height - 18),
        )
        sheet.paste(panel.convert("RGB"), (left + 12, 72))
        draw.rectangle((left + 3, 3, left + cell_w - 4, cell_h - 4), outline="#6f4c24", width=3)
        draw.text((left + 18, 18), label, fill="#2b2014", font=title_font)
        draw.text((left + 18, 508), "透明PNG｜512×512｜统一脚点", fill="#604a31", font=note_font)
    sheet.save(OUTPUT / "core-building-assets-qc.png")


def build_forge_working_preview(runtime: dict[str, Path]) -> None:
    forge = Image.open(runtime["bldg_artifact_forge_iso_idle"]).convert("RGBA")
    effect = Image.open(runtime["fx_forge_da_geng_sword_array_active_7"]).convert("RGBA")
    fx_visible = fit_visible(effect, 156, 172)
    # The idle forge's circular formation platform is on its lower-right side.
    forge.alpha_composite(fx_visible, (342 - fx_visible.width // 2, 392 - fx_visible.height))
    destination = OUTPUT / "bldg_artifact_forge_iso_working_preview.png"
    forge.save(destination)
    runtime["bldg_artifact_forge_iso_working_preview"] = destination


def paste_at_anchor(
    base: Image.Image,
    sprite: Image.Image,
    anchor: tuple[int, int],
    visual_width: int,
) -> tuple[int, int, int, int]:
    visible = crop_visible(sprite)
    scale = visual_width / visible.width
    resized = visible.resize(
        (max(1, round(visible.width * scale)), max(1, round(visible.height * scale))),
        Image.Resampling.LANCZOS,
    )
    left = anchor[0] - resized.width // 2
    top = anchor[1] - resized.height
    base.alpha_composite(resized, (left, top))
    return left, top, left + resized.width, top + resized.height


def build_map_preview(runtime: dict[str, Path]) -> None:
    base = Image.open(MAP_SOURCE).convert("RGBA")
    mine = Image.open(runtime["bldg_spirit_mine_iso"]).convert("RGBA")
    forge = Image.open(runtime["bldg_artifact_forge_iso_idle"]).convert("RGBA")
    shop = Image.open(runtime["bldg_artifact_shop_iso"]).convert("RGBA")
    working_forge = Image.open(runtime["bldg_artifact_forge_iso_working_preview"]).convert("RGBA")

    # One continuous 4x2 production district at a true in-map viewing scale.
    anchors = [
        (307, 190),
        (449, 190),
        (591, 190),
        (733, 190),
        (307, 290),
        (449, 290),
        (591, 290),
        (733, 290),
    ]
    sequence = [mine, forge, shop, mine, shop, working_forge, mine, shop]
    safe_bounds = (180, 20, 792, 315)
    placement_bounds: list[tuple[int, int, int, int]] = []
    for anchor, sprite in zip(anchors, sequence):
        bounds = paste_at_anchor(base, sprite, anchor, 116)
        placement_bounds.append(bounds)
        if not (
            bounds[0] >= safe_bounds[0]
            and bounds[1] >= safe_bounds[1]
            and bounds[2] <= safe_bounds[2]
            and bounds[3] <= safe_bounds[3]
        ):
            raise ValueError(f"preview building outside safe area: anchor={anchor}, bounds={bounds}")

    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle((1090, 22, 1642, 122), radius=12, fill=(249, 239, 205, 235), outline="#6f4c24", width=3)
    draw.text((1111, 34), "第二生产链·正式建筑实机比例", fill="#2b2014", font=font(28, bold=True))
    draw.text((1111, 76), "灵矿场 → 炼器坊（七剑工作态）→ 法器铺", fill="#5b3b1b", font=font(21))
    draw.text((1111, 103), "建筑可见宽度约116px；连续4×2区域不互相遮挡", fill="#5b3b1b", font=font(17))
    base.convert("RGB").save(OUTPUT / "core-building-map-scale-preview.jpg", quality=94)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for source in ASSETS.values():
        if not source.exists():
            raise FileNotFoundError(source)

    runtime: dict[str, Path] = {}
    manifest: dict[str, dict] = {}
    for key, declared_source in ASSETS.items():
        source = preferred_cutout(declared_source)
        destination = OUTPUT / f"{key}.png"
        if key.startswith("fx_"):
            manifest[key] = normalize_effect(source, destination)
        else:
            manifest[key] = normalize_building(source, destination)
        runtime[key] = destination

    build_forge_working_preview(runtime)
    build_qc_sheet(runtime)
    build_map_preview(runtime)
    (OUTPUT / "manifest.json").write_text(
        json.dumps(
            {
                "status": "pending-user-approval",
                "canvas": [512, 512],
                "buildingDisplayWidthInPreview": 116,
                "previewPlacement": {
                    "safeBounds": [180, 20, 792, 315],
                    "anchors": [
                        [307, 190], [449, 190], [591, 190], [733, 190],
                        [307, 290], [449, 290], [591, 290], [733, 290],
                    ],
                    "swordEnergy": "seven hairline pale-cyan qi filaments, one per sword",
                },
                "assets": manifest,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
