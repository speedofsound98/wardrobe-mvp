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
- category: MUST be one of: top, bottom, shoes, outerwear, accessory
- subcategory: specific type (e.g. shirt, jeans, sneakers, blazer, boots, scarf)
- color: MUST be one of: black, white, gray, blue, navy, brown, beige, green, red, pink
  - If the color doesn't match exactly, pick the closest one
- season: MUST be one of: all, spring, summer, autumn, winter
- occasion: MUST be one of: casual, work, date, travel, gym, running, formal, wedding
- material: best guess (e.g. cotton, denim, leather, wool, polyester, linen, silk)
- favorite: false
- imageUrl: leave empty
- sourceType: manual
- sourceValue: leave empty
- createdAt: use today's date in ISO format (e.g. 2026-06-15T10:00:00.000Z)

Output ONLY the header row followed by one data row per item. No other text.
```

---

## How to import

1. Copy the CSV output from the LLM into a text file and save it as `wardrobe.csv`
2. Open the wardrobe app → Wardrobe page
3. Click **Import CSV**
4. Select your `wardrobe.csv` file

Items will be merged with your existing wardrobe (no duplicates).

---

## Tips

- You can send multiple images in one message — the LLM will output one row per item
- If you already have a `wardrobe.csv`, paste your existing rows below the header and ask the LLM to append new rows to it
- The `imageUrl` column will be empty after LLM import — go to the item's Edit page to upload a photo to Cloudinary
- You can edit any field after import using the Edit button on each item card
