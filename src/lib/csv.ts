import type { WardrobeItem } from "./types";

const HEADERS: (keyof WardrobeItem)[] = [
  "id", "name", "category", "subcategory", "color", "season",
  "occasion", "material", "favorite", "imageUrl", "sourceType", "sourceValue", "createdAt",
];

function escape(value: string | boolean): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsv(items: WardrobeItem[]): void {
  const rows = [
    HEADERS.join(","),
    ...items.map((item) => HEADERS.map((h) => escape(item[h])).join(",")),
  ];
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wardrobe.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromCsv(file: File): Promise<WardrobeItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const [headerRow, ...dataRows] = text.trim().split("\n");
        const headers = headerRow.split(",") as (keyof WardrobeItem)[];

        const items: WardrobeItem[] = dataRows
          .filter((row) => row.trim())
          .map((row) => {
            const values = parseRow(row);
            const item: Partial<WardrobeItem> = {};
            headers.forEach((h, i) => {
              const val = values[i] ?? "";
              (item as Record<string, unknown>)[h] = h === "favorite" ? val === "true" : val;
            });
            return item as WardrobeItem;
          });

        resolve(items);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function parseRow(row: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}
