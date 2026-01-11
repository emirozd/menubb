import pandas as pd
import datetime
import json

INPUT_FILE = "OCAK.xlsx"
SHEET_NAME = "KAHVALTI"

df = pd.read_excel(INPUT_FILE, sheet_name=SHEET_NAME)

result = {}
columns = list(df.columns)

for i in range(0, len(columns), 2):
    date_col = columns[i]
    cal_col = columns[i + 1]

    # Tarih değilse geç
    if not isinstance(date_col, (pd.Timestamp, datetime.date, datetime.datetime)):
        continue

    date_key = pd.to_datetime(date_col).strftime("%Y-%m-%d")
    result.setdefault(date_key, {"kahvalti": []})

    for _, row in df.iterrows():
        food_cell = row[date_col]
        cal_cell = row[cal_col]

        # ❌ BOŞ HÜCRELERİ KESİN AT
        if pd.isna(food_cell) or pd.isna(cal_cell):
            continue

        food = str(food_cell).strip()

        # ❌ TOPLAM SATIRINI AT
        if food.upper().startswith("TOPLAM"):
            continue

        result[date_key]["kahvalti"].append({
            "category": "Kahvaltılık",
            "name": food,
            "calories": f"{int(cal_cell)} kcal"
        })

# Test
print(json.dumps(result, ensure_ascii=False, indent=2))

OUTPUT_FILE = "menu.json"

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("menu.json başarıyla oluşturuldu ✅")