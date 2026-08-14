from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PRODUCTION = ROOT / "deliverables" / "v012-art-production" / "production"
SOURCE_ROOT = PRODUCTION / "decor-batch-d1-v1"
OUTPUT = PRODUCTION / "decor-batch-d1-runtime-v1"
MAP_SOURCE = ROOT / "deliverables" / "v011-map-rebuild" / "equal-parcel" / "single-map-roads-3bridges-source.png"
CORE = PRODUCTION / "runtime-core-v3"

ASSETS = {
    "prop_ore_pile": SOURCE_ROOT / "prop_ore_pile" / "source-magenta" / "cutout.png",
    "prop_mine_cart": SOURCE_ROOT / "prop_mine_cart" / "source-magenta" / "cutout.png",
    "prop_sword_rack": SOURCE_ROOT / "prop_sword_rack" / "source-magenta" / "cutout.png",
    "prop_outdoor_anvil": SOURCE_ROOT / "prop_outdoor_anvil" / "source-magenta" / "cutout.png",
}

LIMITS = {
    "prop_ore_pile": (158, 145),
    "prop_mine_cart": (165, 145),
    "prop_sword_rack": (142, 190),
    "prop_outdoor_anvil": (165, 145),
}

DISPLAY_WIDTHS = {
    "prop_ore_pile": 58,
    "prop_mine_cart": 62,
    "prop_sword_rack": 52,
    "prop_outdoor_anvil": 62,
}


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    box = image.getchannel("A").getbbox()
    if not box:
        raise ValueError("asset has no visible pixels")
    return box


def remove_connected_magenta(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    width, height = image.size
    pixels = list(image.getdata())
    transparent = bytearray(width * height)
    candidate = bytearray(width * height)
    for index, (red, green, blue, alpha) in enumerate(pixels):
        if alpha < 12:
            transparent[index] = 1
            continue
        bias = min(red, blue) - green
        # This batch intentionally has no purple materials. Remove every
        # magenta-biased chroma/shadow pixel, including dark baked shadows,
        # while preserving cyan spirit light and warm wood/bronze.
        if min(red, blue) > 58 and green < 96 and bias > 28:
            pixels[index] = (0, 0, 0, 0)
            transparent[index] = 1
            continue
        elif red > 70 and blue > 65 and green < 60 and bias > 42:
            candidate[index] = 1

    queue: deque[int] = deque()
    visited = bytearray(width * height)
    for index, is_candidate in enumerate(candidate):
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
            visited[index] = 1

    while queue:
        index = queue.popleft()
        x, y = index % width, index // width
        neighbors = (
            index - 1 if x else -1,
            index + 1 if x + 1 < width else -1,
            index - width if y else -1,
            index + width if y + 1 < height else -1,
        )
        for neighbor in neighbors:
            if neighbor >= 0 and candidate[neighbor] and not visited[neighbor]:
                visited[neighbor] = 1
                queue.append(neighbor)

    for index, remove in enumerate(visited):
        if remove:
            pixels[index] = (0, 0, 0, 0)
    image.putdata(pixels)
    return image


def harden_alpha(image: Image.Image, threshold: int = 30) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, alpha = pixels[x, y]
            pixels[x, y] = (red, green, blue, 255) if alpha >= threshold else (0, 0, 0, 0)
    return image


def normalize(key: str, source: Path) -> tuple[Path, dict]:
    image = harden_alpha(remove_connected_magenta(Image.open(source)))
    image = image.crop(alpha_bbox(image))
    max_width, max_height = LIMITS[key]
    scale = min(max_width / image.width, max_height / image.height)
    image = image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.Resampling.NEAREST,
    )
    image = harden_alpha(remove_connected_magenta(image), 24)
    # Chroma-colored baked shadows may disappear during cleanup. Re-trim after
    # that cleanup so the real ground-contact pixel, not the removed shadow,
    # is aligned to the runtime anchor.
    image = image.crop(alpha_bbox(image))
    canvas = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    left = 128 - image.width // 2
    top = 236 - image.height
    canvas.alpha_composite(image, (left, top))
    destination = OUTPUT / f"{key}.png"
    canvas.save(destination)
    return destination, {
        "canvas": [256, 256],
        "alphaBounds": list(alpha_bbox(canvas)),
        "anchor": [128, 236],
        "footprint": "1x1 decoration",
        "displayWidth": DISPLAY_WIDTHS[key],
        "source": str(source.relative_to(ROOT)),
    }


def checker(size: tuple[int, int], cell: int = 16) -> Image.Image:
    image = Image.new("RGBA", size, "#dedede")
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill="#bdbdbd")
    return image


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        Path("C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"),
        Path("C:/Windows/Fonts/simhei.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def visible(image: Image.Image) -> Image.Image:
    return image.crop(alpha_bbox(image))


def fit(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
    image = visible(image)
    scale = min(max_width / image.width, max_height / image.height)
    return image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.Resampling.NEAREST,
    )


def build_contact_sheet(runtime: dict[str, Path]) -> None:
    labels = [
        ("灵矿石堆", "prop_ore_pile"),
        ("载矿小车", "prop_mine_cart"),
        ("法器兵器架", "prop_sword_rack"),
        ("室外锻造台", "prop_outdoor_anvil"),
    ]
    cell_width, cell_height = 360, 460
    sheet = Image.new("RGB", (cell_width * 4, cell_height), "#efe7d0")
    draw = ImageDraw.Draw(sheet)
    for index, (label, key) in enumerate(labels):
        left = index * cell_width
        panel = checker((324, 330))
        sprite = fit(Image.open(runtime[key]).convert("RGBA"), 270, 270)
        panel.alpha_composite(sprite, ((panel.width - sprite.width) // 2, panel.height - sprite.height - 20))
        sheet.paste(panel.convert("RGB"), (left + 18, 70))
        draw.rectangle((left + 4, 4, left + cell_width - 5, cell_height - 5), outline="#6f4c24", width=3)
        draw.text((left + 20, 20), label, fill="#2b2014", font=font(25, bold=True))
        draw.text((left + 20, 415), "透明PNG｜1×1装饰位｜底部中心脚点", fill="#604a31", font=font(16))
    sheet.save(OUTPUT / "decor-batch-d1-contact-sheet.png")


def paste_at_anchor(base: Image.Image, sprite: Image.Image, anchor: tuple[int, int], width: int) -> None:
    sprite = visible(sprite)
    scale = width / sprite.width
    sprite = sprite.resize(
        (width, max(1, round(sprite.height * scale))),
        Image.Resampling.NEAREST,
    )
    base.alpha_composite(sprite, (anchor[0] - sprite.width // 2, anchor[1] - sprite.height))


def build_map_preview(runtime: dict[str, Path]) -> None:
    base = Image.open(MAP_SOURCE).convert("RGBA")
    forge = Image.open(CORE / "bldg_artifact_forge_iso_idle.png").convert("RGBA")
    paste_at_anchor(base, forge, (1270, 245), 116)
    anchors = {
        "prop_ore_pile": (1080, 200),
        "prop_mine_cart": (1165, 282),
        "prop_sword_rack": (1375, 202),
        "prop_outdoor_anvil": (1460, 282),
    }
    for key, anchor in anchors.items():
        paste_at_anchor(base, Image.open(runtime[key]).convert("RGBA"), anchor, DISPLAY_WIDTHS[key])
    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle((28, 24, 570, 122), radius=12, fill=(249, 239, 205, 235), outline="#6f4c24", width=3)
    draw.text((48, 38), "第二生产链装饰·第一批实机比例", fill="#2b2014", font=font(27, bold=True))
    draw.text((48, 82), "灵矿石堆｜载矿小车｜兵器架｜室外锻造台", fill="#5b3b1b", font=font(19))
    base.convert("RGB").save(OUTPUT / "decor-batch-d1-map-preview.jpg", quality=94)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    runtime: dict[str, Path] = {}
    manifest: dict[str, dict] = {}
    for key, source in ASSETS.items():
        if not source.exists():
            raise FileNotFoundError(source)
        runtime[key], manifest[key] = normalize(key, source)
    build_contact_sheet(runtime)
    build_map_preview(runtime)
    (OUTPUT / "manifest.json").write_text(
        json.dumps(
            {
                "status": "pending-user-approval",
                "batch": "D1",
                "assets": manifest,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
