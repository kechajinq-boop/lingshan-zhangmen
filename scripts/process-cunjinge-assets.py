from pathlib import Path

from collections import deque

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "public" / "assets" / "v13" / "cunjinge"
DELIVERABLE_ROOT = ROOT / "deliverables" / "v0130-cunjinge-prototype" / "assets"


def fit_rgba(image: Image.Image, size: tuple[int, int], padding: int) -> Image.Image:
    image = image.convert("RGBA")
    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
    if bounds:
        image = image.crop(bounds)
    target_w, target_h = size
    scale = min((target_w - padding * 2) / max(1, image.width), (target_h - padding * 2) / max(1, image.height))
    resized = image.resize((max(1, round(image.width * scale)), max(1, round(image.height * scale))), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((target_w - resized.width) // 2, target_h - padding - resized.height))
    return canvas


def keep_largest_component(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    alpha = image.getchannel("A")
    pixels = alpha.load()
    visited = bytearray(image.width * image.height)
    components: list[list[tuple[int, int]]] = []
    for y in range(image.height):
        for x in range(image.width):
            offset = y * image.width + x
            if visited[offset] or pixels[x, y] <= 18:
                continue
            visited[offset] = 1
            queue = deque([(x, y)])
            component: list[tuple[int, int]] = []
            while queue:
                px, py = queue.popleft()
                component.append((px, py))
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if nx < 0 or ny < 0 or nx >= image.width or ny >= image.height:
                        continue
                    noffset = ny * image.width + nx
                    if visited[noffset] or pixels[nx, ny] <= 18:
                        continue
                    visited[noffset] = 1
                    queue.append((nx, ny))
            components.append(component)
    if not components:
        return image
    largest = max(components, key=len)
    keep = set(largest)
    cleaned = image.copy()
    data = cleaned.load()
    for y in range(image.height):
        for x in range(image.width):
            if (x, y) not in keep:
                data[x, y] = (0, 0, 0, 0)
    return cleaned


def slice_atlas(source: Path, output_dir: Path, columns_per_row: list[int], take_per_row: list[int], prefix: str, size: tuple[int, int], padding: int, largest_component_only: bool = False) -> list[Path]:
    atlas = Image.open(source).convert("RGBA")
    output_dir.mkdir(parents=True, exist_ok=True)
    outputs: list[Path] = []
    rows = len(columns_per_row)
    for row, (columns, take) in enumerate(zip(columns_per_row, take_per_row)):
        y0 = round(row * atlas.height / rows)
        y1 = round((row + 1) * atlas.height / rows)
        for column in range(take):
            x0 = round(column * atlas.width / columns)
            x1 = round((column + 1) * atlas.width / columns)
            crop = atlas.crop((x0, y0, x1, y1))
            if largest_component_only:
                crop = keep_largest_component(crop)
            normalized = fit_rgba(crop, size, padding)
            path = output_dir / f"{prefix}-{len(outputs) + 1:02d}.png"
            normalized.save(path, optimize=True)
            outputs.append(path)
    return outputs


def build_contact_sheet(paths: list[Path], output: Path, columns: int, cell: tuple[int, int]) -> None:
    rows = (len(paths) + columns - 1) // columns
    sheet = Image.new("RGBA", (columns * cell[0], rows * cell[1]), (40, 31, 25, 255))
    draw = ImageDraw.Draw(sheet)
    for index, path in enumerate(paths):
        image = Image.open(path).convert("RGBA")
        x = (index % columns) * cell[0]
        y = (index // columns) * cell[1]
        checker = (74, 61, 48, 255) if (index + index // columns) % 2 else (55, 46, 38, 255)
        draw.rectangle((x, y, x + cell[0], y + cell[1]), fill=checker)
        thumb = image.copy()
        thumb.thumbnail((cell[0] - 8, cell[1] - 8), Image.Resampling.LANCZOS)
        sheet.alpha_composite(thumb, (x + (cell[0] - thumb.width) // 2, y + (cell[1] - thumb.height) // 2))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.convert("RGB").save(output, quality=92)


def mirror_runtime_assets(paths: list[Path], target_dir: Path) -> None:
    target_dir.mkdir(parents=True, exist_ok=True)
    for path in paths:
        Image.open(path).save(target_dir / path.name, optimize=True)


def main() -> None:
    player_source = Image.open(SOURCE_ROOT / "npc" / "player-master-source.png").convert("RGBA")
    player_final = fit_rgba(keep_largest_component(player_source), (256, 256), 4)
    player_path = SOURCE_ROOT / "npc" / "final" / "player-master.png"
    player_path.parent.mkdir(parents=True, exist_ok=True)
    player_final.save(player_path, optimize=True)
    npc_paths = slice_atlas(
        SOURCE_ROOT / "npc" / "npc-atlas-transparent.png",
        SOURCE_ROOT / "npc" / "final",
        [6, 6, 8, 8],
        [4, 4, 8, 8],
        "npc",
        (256, 256),
        6,
        True,
    )
    treasure_paths = slice_atlas(
        SOURCE_ROOT / "treasure" / "treasure-atlas-source.png",
        SOURCE_ROOT / "treasure" / "final",
        [8, 8, 8, 8, 8],
        [8, 8, 8, 8, 8],
        "treasure",
        (160, 160),
        8,
    )
    build_contact_sheet(npc_paths, SOURCE_ROOT / "npc" / "npc-contact-sheet.jpg", 6, (128, 128))
    build_contact_sheet(treasure_paths, SOURCE_ROOT / "treasure" / "treasure-contact-sheet.jpg", 8, (96, 96))
    mirror_runtime_assets(npc_paths, DELIVERABLE_ROOT / "npc")
    mirror_runtime_assets([player_path], DELIVERABLE_ROOT / "npc")
    mirror_runtime_assets(treasure_paths, DELIVERABLE_ROOT / "treasure")
    print(f"Prepared {len(npc_paths)} NPC portraits and {len(treasure_paths)} treasure icons")


if __name__ == "__main__":
    main()
