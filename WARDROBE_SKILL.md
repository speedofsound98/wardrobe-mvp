# Wardrobe CSV Skill

Use this prompt with any LLM (Claude, ChatGPT, etc.) that supports image input.
Send it one or more clothing photos and it will return a CSV you can import directly into the wardrobe app.

---

## Prompt to use

```
You are a wardrobe cataloguing assistant. I will give you one or more images of clothing items.

For each item, output a single CSV row using EXACTLY this format (no extra text, no markdown, no explanation):

id,name,category,subcategory,color,season,occasion,material,favorite,imageUrl,sourceType,sourceValue,createdAt

Rules:
- id: generate a random 8-character alphanumeric string (e.g. "a3f9kx12")
- name: a short descriptive name (e.g. "White Linen Shirt", "Black Skinny Jeans")
- category: MUST be one of: top, pants, skirt, dress, shoes, outerwear, accessory
  - Use "dress" for any one-piece dress garment
  - Use "skirt" for skirts
  - Use "pants" for trousers, jeans, shorts, leggings
  - Use "top" for shirts, blouses, sweaters, tanks
- subcategory: specific type (e.g. shirt, jeans, sneakers, blazer, midi dress, maxi skirt)
- color: MUST be one of: black, white, gray, blue, navy, brown, beige, green, red, pink
  - If the color doesn't match exactly, pick the closest one
- season: MUST be one of: all, spring, summer, autumn, winter
- occasion: MUST be one of: casual, work, date, travel, gym, running, formal, wedding
- material: best guess (e.g. cotton, denim, leather, wool, polyester, linen, silk)
- favorite: false
- imageUrl: leave empty (images will be uploaded separately — see below)
- sourceType: manual
- sourceValue: write the image filename or a short image description so you can match it later
  (e.g. "image_1.jpg" or "blue slip dress photo")
- createdAt: use today's date in ISO format (e.g. 2026-06-15T10:00:00.000Z)

Output ONLY the header row followed by one data row per item. No other text.
```

---

## How to import

1. Copy the CSV output from the LLM into a text file and save it as `wardrobe.csv`
2. Open the wardrobe app → Wardrobe page
3. Click **Import CSV**
4. Items appear immediately (without images)

---

## Adding images after import

After importing, each item's `sourceValue` column contains the filename or description you gave it.
Use this to match the item to its photo:

1. Go to **Wardrobe** → find the item (use the name or description)
2. Click **Edit**
3. Upload the photo — it goes to Cloudinary and saves automatically
4. Repeat for each item

**Tip:** If you have many items, keep the LLM chat open and ask it to list item names alongside their image filenames so you can match them easily.

---

## Appending to an existing wardrobe

If you already have a `wardrobe.csv`, paste the existing rows below the header and ask the LLM to add new rows after them. Import will merge by ID — no duplicates.

---

## Category reference

| Category | What it covers |
|----------|---------------|
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
