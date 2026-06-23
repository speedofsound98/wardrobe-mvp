import type { WardrobeItem } from "./types";

const HEADERS: (keyof WardrobeItem)[] = [
  "id", "name", "category", "subcategory", "color", "season",
  "occasions", "material", "brand", "quantity", "favorite", "imageUrl", "sourceType", "sourceValue", "createdAt",
];

function escape(value: string | boolean | string[]): string {
  const str = Array.isArray(value) ? value.join("|") : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsv(items: WardrobeItem[]): void {
  const rows = [
    HEADERS.join(","),
    ...items.map((item) => HEADERS.map((h) => escape(item[h] as string | boolean | string[])).join(",")),
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
              if (h === "favorite") (item as Record<string, unknown>)[h] = val === "true";
              else if (h === "quantity") (item as Record<string, unknown>)[h] = val ? parseInt(val, 10) || 1 : 1;
              else if (h === "occasions") (item as Record<string, unknown>)[h] = val ? val.split("|") : ["casual"];
              // migrate old CSVs that used "occasion" column
              else if ((h as string) === "occasion") {
                if (!(item as Record<string, unknown>)["occasions"]) {
                  (item as Record<string, unknown>)["occasions"] = val ? [val] : ["casual"];
                }
              } else (item as Record<string, unknown>)[h] = val;
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
