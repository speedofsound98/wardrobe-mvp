# Wardrobe CSV Skill

Use this prompt with any LLM (Claude, ChatGPT, etc.) that supports image input.
Two modes are available — pick the one that matches your input.

---

## Mode 1 — Individual clothing photos

Send one or more photos where **each image shows a single item**.
The LLM will output one CSV row per item.

### Prompt

```
You are a wardrobe cataloguing assistant. I will give you one or more clothing photos.
Each image shows a single clothing item.

Output a CSV using EXACTLY this format — header row first, then one data row per item:

id,name,category,subcategory,color,season,occasions,material,favorite,imageUrl,sourceType,sourceValue,createdAt

Field rules:
- id: random 8-character alphanumeric string (e.g. "a3f9kx12")
- name: short descriptive label (e.g. "White Linen Shirt", "Black Skinny Jeans")
- category: MUST be one of: top, pants, skirt, dress, shoes, outerwear, accessory
  - dress = any one-piece dress
  - skirt = skirts
  - pants = trousers, jeans, shorts, leggings
  - top = shirts, blouses, sweaters, tanks
- subcategory: specific type (e.g. shirt, jeans, sneakers, midi dress, maxi skirt)
- color: MUST be one of: black, white, gray, blue, navy, brown, beige, green, red, pink
  Pick the closest if exact color is not listed.
- season: MUST be one of: all, spring, summer, autumn, winter
- occasions: one or more from this list, separated by | (pipe):
    casual, work, date, travel, gym, running, formal, wedding
  Example: casual|work|travel
- material: best guess (cotton, denim, leather, wool, polyester, linen, silk, etc.)
- favorite: false
- imageUrl: leave empty — images are uploaded to Cloudinary separately
- sourceType: manual
- sourceValue: image filename or short description to match photo later
  (e.g. "img_001.jpg" or "blue slip dress photo")
- createdAt: today's date in ISO format (e.g. 2026-06-15T10:00:00.000Z)

Output ONLY the header row and data rows. No other text, no markdown fences.
```

---

## Mode 2 — Order sheet or catalog image

Send a **single image that shows multiple items** — e.g. an online order confirmation,
a brand lookbook page, a flat-lay of a haul, or a screenshot with item photos and names side by side.

The LLM will identify each item in the image, crop it mentally, and output one row per item —
including saving the crop coordinates so you can extract the image later.

### Prompt

```
You are a wardrobe cataloguing assistant. I will give you a single image that contains
multiple clothing items — for example an order summary, a catalog page, or a haul flat-lay.

Your job:
1. Identify each distinct clothing item in the image.
2. For each item, output one CSV row.
3. In the imageUrl column, write a crop descriptor in this exact format:
   crop:<x%>,<y%>,<w%>,<h%>
   where x,y is the top-left corner of the item in the image (as % of total image size)
   and w,h is the width and height of the bounding box (also as %).
   Example: crop:10%,5%,30%,40%
   This lets you extract and upload each item's photo to Cloudinary later (see instructions below).
4. In sourceValue, write the item name or label exactly as it appears in the image
   (e.g. "Floral Midi Dress – Blue" or "Item 3"). If no label is visible, describe it briefly.

Output a CSV using EXACTLY this format — header row first, then one data row per item:

id,name,category,subcategory,color,season,occasions,material,favorite,imageUrl,sourceType,sourceValue,createdAt

Field rules:
- id: random 8-character alphanumeric string
- name: short clean label (can differ from the label in the image if cleaner)
- category: MUST be one of: top, pants, skirt, dress, shoes, outerwear, accessory
- subcategory: specific type (shirt, jeans, sneakers, midi dress, maxi skirt, etc.)
- color: MUST be one of: black, white, gray, blue, navy, brown, beige, green, red, pink
- season: MUST be one of: all, spring, summer, autumn, winter
- occasions: one or more from this list, separated by | (pipe):
    casual, work, date, travel, gym, running, formal, wedding
- material: best guess from visual or any text visible in the image
- favorite: false
- imageUrl: crop:<x%>,<y%>,<w%>,<h%>  (bounding box of this item in the image)
- sourceType: manual
- sourceValue: label or description as it appears in the image
- createdAt: today's date in ISO format

Output ONLY the header row and data rows. No other text, no markdown fences.
```

### After getting the CSV — extracting crop images for Cloudinary

The `imageUrl` column will contain crop descriptors like `crop:10%,5%,30%,40%`.
Use one of these methods to cut each item out and upload to Cloudinary:

**Option A — Manual (any image editor)**
1. Open the original order/catalog image in Preview, Photoshop, or any editor.
2. For each row, read the crop coordinates and crop to that region.
3. Save as a PNG/JPG, then in the wardrobe app go to **Edit** → upload the cropped photo.

**Option B — Ask the LLM to produce the crops**
After receiving the CSV, reply with:
```
Now output each cropped item as a separate image, one at a time, labeled with its id.
```
Claude (and some other models) can render cropped sub-images. Save each one and upload via Edit in the app.

**Option C — Automated script (for power users)**
```python
# pip install pillow
from PIL import Image

img = Image.open("order_screenshot.png")
W, H = img.size

crops = [
    ("a3f9kx12", "10%,5%,30%,40%"),   # paste from CSV imageUrl column
    # ...
]

for item_id, coords in crops:
    x_pct, y_pct, w_pct, h_pct = [float(c.strip('%')) / 100 for c in coords.split(',')]
    box = (int(x_pct*W), int(y_pct*H), int((x_pct+w_pct)*W), int((y_pct+h_pct)*H))
    img.crop(box).save(f"{item_id}.png")
```
Then clear the `imageUrl` field in the CSV before importing (or upload via Edit after import).

---

## How to import

1. Copy the CSV output into a text editor and save as `wardrobe.csv`
2. Open the wardrobe app → **Wardrobe** page
3. Click **Import CSV**
4. Items appear immediately (images upload separately via Edit)

---

## Adding images after import

Each item's `sourceValue` column holds the label or filename to match the photo.

1. In the app go to **Wardrobe** → find the item by name
2. Click **Edit** → upload the photo (or the cropped sub-image)
3. The photo goes to Cloudinary and saves automatically
4. Repeat for each item

**Tip:** In the quick-view modal you can drag the image to reframe which part shows in thumbnails.

---

## Appending to an existing wardrobe

Paste your existing rows below the header in the CSV file and ask the LLM to add new rows after them.
Import merges by ID — no duplicates will be created.

---

## Category reference

| Category | What it covers |
|----------|----------------|
| top | Shirts, blouses, sweaters, tank tops, t-shirts |
| pants | Trousers, jeans, shorts, leggings, culottes |
| skirt | All skirt lengths (mini, midi, maxi) |
| dress | All one-piece dresses |
| shoes | Sneakers, boots, heels, sandals, loafers |
| outerwear | Jackets, coats, blazers, cardigans |
| accessory | Bags, belts, scarves, hats, jewellery |

## Occasion reference

| Occasion | When to use |
|----------|-------------|
| casual | Everyday wear |
| work | Office / professional |
| date | Dinner, going out |
| travel | Airports, sightseeing |
| gym | Workout gear |
| running | Running / sport |
| formal | Black tie, galas |
| wedding | Wedding guest or bride |
