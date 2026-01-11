import * as FileSystem from 'expo-file-system/legacy';

// Linkiniz (Bunun doğruluğundan %100 emin olun, tarayıcıda açınca JSON gelmeli)
const GITHUB_URL = 'https://raw.githubusercontent.com/emirozd/menubb/main/src/data/menu.json';

// Dosya adını değiştirdik (Cache temizliği için)
const LOCAL_FILE_URI = (FileSystem.documentDirectory || FileSystem.cacheDirectory) + 'menu_debug.json';

export const MenuService = {

    updateMenuData: async () => {
        try {
            console.log('🌍 GitHub\'dan veri indiriliyor...');
            const downloadRes = await FileSystem.downloadAsync(GITHUB_URL, LOCAL_FILE_URI);

            if (downloadRes.status === 200) {
                console.log('✅ İndirme Başarılı.');
                return true;
            } else {
                console.log('❌ İndirme Başarısız. Status Code:', downloadRes.status);
                // Eğer 404 geliyorsa link yanlıştır.
                return false;
            }
        } catch (error) {
            console.error('❌ Ağ Hatası:', error);
            return false;
        }
    },

    getMenuData: async () => {
        try {
            // Önce dosyayı silerek her seferinde taze indirmeye zorlayalım (Test için)
            await FileSystem.deleteAsync(LOCAL_FILE_URI, { idempotent: true });

            // Şimdi indir
            const success = await MenuService.updateMenuData();
            if (!success) return null;

            // Dosyayı oku
            const content = await FileSystem.readAsStringAsync(LOCAL_FILE_URI);

            console.log('📄 İNDİRİLEN İÇERİK (İlk 100 karakter):');
            console.log('------------------------------------------------');
            console.log(content.substring(0, 100)); // İçeriğin başını terminale basar
            console.log('------------------------------------------------');

            try {
                return JSON.parse(content);
            } catch (e) {
                console.error('💥 JSON PARSE HATASI! İndirilen şey JSON değil.');
                return null;
            }

        } catch (error) {
            console.error('Genel Hata:', error);
            return null;
        }
    }
};