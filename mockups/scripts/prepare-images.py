"""Turn the client's source files (assets-src/) into web assets (public/img/).

Run from mockups/: `npm run images`. Everything here is derived from her own
material; nothing is generated or stock.
"""
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

SRC = Path("assets-src")
OUT = Path("public/img")
OUT.mkdir(parents=True, exist_ok=True)

spread = Image.open(SRC / "cover-fluturele-spread.jpg").convert("RGB")


def save(img: Image.Image, name: str, quality: int = 84) -> None:
    img.save(OUT / name, "WEBP", quality=quality, method=6)
    print(f"{name:28} {img.size[0]}x{img.size[1]}")


def largest_component(mask: np.ndarray) -> np.ndarray:
    h, w = mask.shape
    labels = np.zeros(mask.shape, int)
    best, current = (0, 0), 0
    for y in range(h):
        for x in range(w):
            if mask[y, x] and not labels[y, x]:
                current += 1
                queue, size = deque([(y, x)]), 0
                labels[y, x] = current
                while queue:
                    yy, xx = queue.popleft()
                    size += 1
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = yy + dy, xx + dx
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not labels[ny, nx]:
                            labels[ny, nx] = current
                            queue.append((ny, nx))
                if size > best[1]:
                    best = (current, size)
    return labels == best[0]


# --- Butterfly: alpha matte from the cover illustration, turned upright and split into wings
crop = spread.crop((1015, 180, 1335, 490))
px = np.asarray(crop).astype(int)
r, g, b = px[..., 0], px[..., 1], px[..., 2]
sat = px.max(-1) - px.min(-1)
lum = 0.299 * r + 0.587 * g + 0.114 * b
ink = (((r - g) > 32) & (sat > 40)) | (lum < 125)
closed = Image.fromarray((ink * 255).astype(np.uint8), "L")
for _ in range(6):
    closed = closed.filter(ImageFilter.MaxFilter(3))
for _ in range(6):
    closed = closed.filter(ImageFilter.MinFilter(3))
w, h = closed.size
padded = Image.new("L", (w + 2, h + 2), 0)
padded.paste(closed, (1, 1))
ImageDraw.floodfill(padded, (0, 0), 128, thresh=10)
filled = np.asarray(padded)[1:-1, 1:-1] != 128
paper = (lum > 226) & (sat < 24)
alpha = (largest_component(filled) & ~paper).astype(np.uint8) * 255
alpha_img = (
    Image.fromarray(alpha, "L")
    .filter(ImageFilter.MaxFilter(3))
    .filter(ImageFilter.MinFilter(3))
    .filter(ImageFilter.GaussianBlur(0.9))
)
butterfly = crop.convert("RGBA")
butterfly.putalpha(alpha_img)
butterfly = butterfly.crop(butterfly.getbbox())
upright = butterfly.rotate(-20, resample=Image.BICUBIC, expand=True)
upright = upright.crop(upright.getbbox())
upright = upright.resize((upright.width * 3 // 2, upright.height * 3 // 2), Image.LANCZOS)
body_x = round(upright.width * 129 / 298)
save(upright, "butterfly.webp", 90)
save(upright.crop((0, 0, body_x, upright.height)), "butterfly-wing-l.webp", 90)
save(upright.crop((body_x, 0, upright.width, upright.height)), "butterfly-wing-r.webp", 90)
print(f"butterfly body split at {body_x / upright.width:.4f} of width")

# --- Front cover
save(spread.crop((812, 28, 1578, 1148)), "cover-fluturele.webp", 86)

# --- Meadow band from the cover: publisher text cloned out, top feathered into the sky
meadow = spread.crop((852, 560, 1497, 1065)).copy()
patch = meadow.crop((204, 410, 268, 466))
mask = Image.new("L", patch.size, 0)
ImageDraw.Draw(mask).rounded_rectangle((4, 4, patch.width - 4, patch.height - 4), 10, fill=255)
meadow.paste(patch, (268, 410), mask.filter(ImageFilter.GaussianBlur(4)))
feather = Image.linear_gradient("L").resize(meadow.size)
feather = feather.point(lambda v: max(0, min(255, int((v - 20) * 2.4))))
meadow_rgba = meadow.convert("RGBA")
meadow_rgba.putalpha(feather)
# Laptop-width band: the painting repeated (never mirrored next to itself, which shows a
# symmetric seam), each repeat at a slightly different scale, colours cross-faded over a wide
# overlap, then the same sky feather applied once to the whole band.
def scaled(tile: Image.Image, k: float) -> Image.Image:
    big = tile.resize((round(tile.width * k), round(tile.height * k)), Image.LANCZOS)
    return big.crop((0, big.height - tile.height, big.width, big.height))


overlap = 240
tiles = [meadow, scaled(meadow, 1.14), ImageOps.mirror(meadow)]
xs, x = [], 0
for tile in tiles:
    xs.append(x)
    x += tile.width - overlap
canvas = np.zeros((meadow.height, xs[-1] + tiles[-1].width, 3), dtype=np.float32)
for i, tile in enumerate(tiles):
    arr = np.asarray(tile, dtype=np.float32)
    w = np.ones(tile.width, dtype=np.float32)
    if i > 0:
        w[:overlap] = np.linspace(0, 1, overlap)
    region = canvas[:, xs[i] : xs[i] + tile.width]
    region[:] = region * (1 - w[None, :, None]) + arr * w[None, :, None]
wide = Image.fromarray(canvas.clip(0, 255).astype(np.uint8), "RGB").convert("RGBA")
wide.putalpha(feather.resize(wide.size))
save(meadow_rgba, "meadow.webp", 82)
save(wide, "meadow-wide.webp", 80)

# --- Portrait, the watercolor wash
portrait = Image.open(SRC / "portrait.webp").convert("RGB")
save(portrait, "portrait.webp", 84)
save(Image.open(SRC / "watercolor-wash.webp").convert("RGB"), "wash.webp", 80)


# --- Book covers and pages, from the printer's PDFs. Render them first (native PDFKit, no installs):
#   swift scripts/pdf-pages.swift "<Fluturele_interior.pdf>" assets-src/pages/fluturele 4 9
#   swift scripts/pdf-pages.swift "<Buburuza_interior.pdf>" assets-src/pages/buburuza 8 12
#   swift scripts/pdf-pages.swift "<Fluturele_cop.pdf>" assets-src/pages/fluturele-cop 1   (same for Buburuza)
def tall(img: Image.Image, h: int) -> Image.Image:
    return img.resize((round(img.width * h / img.height), h), Image.LANCZOS)


PAGES = SRC / "pages"
if PAGES.exists():
    (OUT / "pages").mkdir(exist_ok=True)
    # the boards inside the printer's guide lines (2.4x render): back cover left of the spine, front right of it
    back, front = (139, 139, 1535, 2201), (1724, 139, 3120, 2201)
    for book, numbers in (("fluturele", (4, 9)), ("buburuza", (8, 12))):
        spread = Image.open(PAGES / f"{book}-cop-p1.png").convert("RGB")
        # „Răsfoiește” opens on the back cover, exactly as printed
        save(tall(spread.crop(back), 1300), f"pages/{book}-coperta-spate.webp", 82)
        for n in numbers:
            save(tall(Image.open(PAGES / f"{book}-p{n}.png").convert("RGB"), 1300), f"pages/{book}-p{n}.webp", 82)
    buburuza = Image.open(PAGES / "buburuza-cop-p1.png").convert("RGB").crop(front)
    save(tall(buburuza, 1120), "cover-buburuza.webp", 84)

    # --- Buburuza's window on Acasă: the cover painting below the title (ladybird, grass, yellow wash),
    # stopping above the „Băuțar 2026” mark, its top feathered into the window's sky like the meadow
    W, H = buburuza.size
    scene = buburuza.crop((0, round(H * 0.272), W, round(H * 0.9)))
    scene = scene.resize((720, round(720 * scene.height / scene.width)), Image.LANCZOS)
    fade = Image.linear_gradient("L").resize(scene.size).point(lambda v: max(0, min(255, int(v * 7))))
    scene = scene.convert("RGBA")
    scene.putalpha(fade)
    save(scene, "buburuza-scene.webp", 84)

    # --- Ladybird cut out of page 9 (she sits on a daisy): an alpha matte from the shell's red, an
    # ellipse for the round head read on the page, and the near-black strokes of legs and antennae
    page9 = Image.open(PAGES / "buburuza-p9.png").convert("RGB").crop((280, 1320, 640, 1700))
    px = np.asarray(page9).astype(int)
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    sat = px.max(-1) - px.min(-1)
    h, w = lum.shape
    yy, xx = np.mgrid[0:h, 0:w]

    def components(mask: np.ndarray, conn8: bool = False):
        lab, sizes, cur = np.zeros(mask.shape, int), {}, 0
        steps = ((1, 0), (-1, 0), (0, 1), (0, -1)) + (((1, 1), (1, -1), (-1, 1), (-1, -1)) if conn8 else ())
        for y0 in range(h):
            for x0 in range(w):
                if mask[y0, x0] and not lab[y0, x0]:
                    cur += 1
                    queue, n = deque([(y0, x0)]), 0
                    lab[y0, x0] = cur
                    while queue:
                        a, c = queue.popleft()
                        n += 1
                        for dy, dx in steps:
                            ny, nx = a + dy, c + dx
                            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not lab[ny, nx]:
                                lab[ny, nx] = cur
                                queue.append((ny, nx))
                    sizes[cur] = n
        return lab, sizes

    def hull(points):
        points = sorted(set(points))
        cross = lambda o, a, c: (a[0] - o[0]) * (c[1] - o[1]) - (a[1] - o[1]) * (c[0] - o[0])
        lower, upper = [], []
        for pt in points:
            while len(lower) >= 2 and cross(lower[-2], lower[-1], pt) <= 0:
                lower.pop()
            lower.append(pt)
        for pt in reversed(points):
            while len(upper) >= 2 and cross(upper[-2], upper[-1], pt) <= 0:
                upper.pop()
            upper.append(pt)
        return lower[:-1] + upper[:-1]

    lab, sizes = components(((r - g) > 70) & (g < 130))
    ys, xs = np.nonzero(lab == max(sizes, key=sizes.get))
    hull_img = Image.new("L", (w, h), 0)
    ImageDraw.Draw(hull_img).polygon(hull(list(zip(xs.tolist(), ys.tolist()))), fill=255)
    shell = np.asarray(hull_img) > 0
    # the shell's pale highlight is not red enough for the hull: an ellipse through its outline, read on the page
    outline = np.array([(31, 215), (65, 135), (125, 95), (180, 97), (205, 180), (200, 240), (190, 280), (100, 312), (45, 280)], float)
    cx, cy = outline.mean(0)
    X, Y = outline[:, 0] - cx, outline[:, 1] - cy
    k = np.linalg.lstsq(np.stack([X * X, X * Y, Y * Y, X, Y], 1), np.ones(len(X)), rcond=None)[0]
    U, V = xx - cx, yy - cy
    shell |= (k[0] * U * U + k[1] * U * V + k[2] * V * V + k[3] * U + k[4] * V) <= 1
    t = np.radians(-18)
    hu, hv = (xx - 247) * np.cos(t) + (yy - 163) * np.sin(t), -(xx - 247) * np.sin(t) + (yy - 163) * np.cos(t)
    head = (hu / 83) ** 2 + (hv / 79) ** 2 <= 1
    body = shell | head
    near = np.asarray(Image.fromarray(body.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(7))) > 0
    # legs are near-black; the thin antennae are greyer
    strokes = ((lum < 72) & (sat < 60)) | ((lum < 120) & (sat < 45) & (yy < 105) & (xx > 180))
    lab, sizes = components(strokes, conn8=True)
    keep = np.zeros_like(strokes)
    for idx, n in sizes.items():
        comp = lab == idx
        if n > 12 and (comp & near).any():
            keep |= comp
    matte = (
        Image.fromarray(((body | keep) * 255).astype(np.uint8), "L")
        .filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
        .filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
        .filter(ImageFilter.GaussianBlur(0.9))
    )
    ladybird = page9.convert("RGBA")
    ladybird.putalpha(matte)
    ladybird = ladybird.crop(ladybird.getbbox())
    save(ladybird.resize((ladybird.width * 3 // 2, ladybird.height * 3 // 2), Image.LANCZOS), "ladybird.webp", 90)
