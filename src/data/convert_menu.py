import pandas as pd
import datetime
import json
import os

# --- AYARLAR ---
INPUT_FILE = "OCAK.xlsx"
OUTPUT_FILE = "menu.json"

def process_menu():
    if not os.path.exists(INPUT_FILE):
        print(f"❌ HATA: '{INPUT_FILE}' bulunamadı. Lütfen dosya ismini kontrol edin.")
        return

    print("Excel dosyası okunuyor...")
    xls = pd.ExcelFile(INPUT_FILE)

    # Sayfa isimlerini otomatik bul (Büyük/küçük harf duyarlılığı olmadan)
    sheet_kahvalti = next((s for s in xls.sheet_names if "KAHVALTI" in s.upper()), None)
    sheet_aksam = next((s for s in xls.sheet_names if "AKŞAM" in s.upper() or "AKSAM" in s.upper()), None)

    if not sheet_kahvalti and not sheet_aksam:
        print("❌ HATA: Kahvaltı veya Akşam sayfası bulunamadı.")
        return

    # Tüm sonuçları toplayacağımız ana sözlük
    result = {}

    # --- YARDIMCI FONKSİYON: SAYFAYI İŞLE ---
    def parse_sheet(sheet_name, meal_key, default_category):
        if not sheet_name:
            print(f"⚠️ UYARI: {meal_key} sayfası bulunamadı, atlanıyor.")
            return

        print(f"🔄 İşleniyor: {sheet_name} -> '{meal_key}'")
        df = pd.read_excel(INPUT_FILE, sheet_name=sheet_name)
        columns = list(df.columns)

        # Sütunları 2'şer 2'şer gez (Tarih, Kalori, Tarih, Kalori...)
        for i in range(0, len(columns), 2):
            if i + 1 >= len(columns): 
                break # Eğer çifti yoksa dur
            
            date_col = columns[i]
            cal_col = columns[i + 1]

            # Başlık bir Tarih mi? Kontrol et.
            is_date = isinstance(date_col, (pd.Timestamp, datetime.date, datetime.datetime))
            if not is_date:
                # Bazen tarih string olarak gelebilir, parse etmeyi dene
                try:
                    pd.to_datetime(date_col)
                    is_date = True
                except:
                    pass
            
            # Eğer başlık tarih değilse bu sütunu atla
            if not is_date:
                continue

            # Tarihi string formata çevir (YYYY-MM-DD)
            date_obj = pd.to_datetime(date_col)
            date_key = date_obj.strftime("%Y-%m-%d")

            # Ana sözlükte bu tarih yoksa oluştur
            if date_key not in result:
                result[date_key] = {}
            
            # Bu tarihin altına ilgili öğün listesini (kahvalti/aksam) ekle
            result[date_key][meal_key] = []

            # O sütundaki satırları gez
            for _, row in df.iterrows():
                food_cell = row[date_col]
                cal_cell = row[cal_col]

                # Boş hücreleri atla
                if pd.isna(food_cell):
                    continue

                food = str(food_cell).strip()

                # "TOPLAM" veya gereksiz satırları atla
                if not food or food.upper().startswith("TOPLAM") or "KALORİ" in food.upper():
                    continue

                # Kalori hücresini düzenle
                calories_str = "0 kcal"
                if not pd.isna(cal_cell):
                    try:
                        calories_str = f"{int(cal_cell)} kcal"
                    except:
                        calories_str = str(cal_cell)

                # Listeye ekle
                result[date_key][meal_key].append({
                    "category": default_category, # Excel'de kategori sütunu olmadığı için sabit veriyoruz
                    "name": food,
                    "calories": calories_str
                })

    # --- İŞLEMLERİ BAŞLAT ---
    # 1. Kahvaltıyı İşle
    parse_sheet(sheet_kahvalti, "kahvalti", "Kahvaltılık")
    
    # 2. Akşamı İşle
    parse_sheet(sheet_aksam, "aksam", "Akşam Menüsü")

    # --- KAYDET ---
    print("💾 JSON dosyası kaydediliyor...")
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"✅ BAŞARILI! '{OUTPUT_FILE}' dosyası oluşturuldu.")

if __name__ == "__main__":
    process_menu()