import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import MealCard from '../components/MealCard';
import { MenuService } from '../services/MenuService'; // Yeni servisimizi çağırıyoruz

const SabahScreen = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // Aşağı çekip yenileme için

    const loadData = async (forceUpdate = false) => {
        // Eğer zorla güncelleme isteniyorsa (aşağı çekince) önce indir
        if (forceUpdate) {
            await MenuService.updateMenuData();
        }

        // Sonra yerel dosyadan oku
        const json = await MenuService.getMenuData();
        if (json) {
            setData(json);
        }
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        loadData(); // Uygulama açılınca veriyi yükle
    }, []);

    // Kullanıcı ekranı aşağı çekince tetiklenecek fonksiyon
    const onRefresh = () => {
        setRefreshing(true);
        loadData(true); // True göndererek internetten güncellemeyi zorluyoruz
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e91e63" />
                <Text>Menü Yükleniyor...</Text>
            </View>
        );
    }

    const dates = data ? Object.keys(data).sort() : [];

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {dates.map((date) => {
                    const dayData = data[date];

                    // DİKKAT: AksamScreen.js için burayı dayData.aksam yapın
                    if (dayData && dayData.kahvalti) {
                        return (
                            <MealCard
                                key={date}
                                date={date}
                                items={dayData.kahvalti}
                            />
                        );
                    }
                    return null;
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default SabahScreen;