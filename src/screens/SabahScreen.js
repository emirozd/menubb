import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MealCard from '../components/MealCard';
import menuData from '../data/menu.json'; // Veri dosyamızı dahil ediyoruz

const SabahScreen = () => {
    // JSON nesnesindeki tarih anahtarlarını alıp sıralıyoruz (Örn: ["2026-01-01", "2026-01-02"])
    const dates = Object.keys(menuData).sort();

    return (
        <View style={styles.container}>
            {/* ScrollView sayesinde liste aşağı doğru kaydırılabilir olacak */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {dates.map((date) => {
                    const dayData = menuData[date];

                    // O günün verisi ve kahvaltı listesi var mı diye kontrol ediyoruz
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
        backgroundColor: '#f8f9fa', // Göz yormayan açık bir arka plan rengi
    },
    scrollContent: {
        paddingTop: 10,
        paddingBottom: 20, // Listenin en altında biraz boşluk bırakır
    },
});

export default SabahScreen;