import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MealCard from '../components/MealCard';
import menuData from '../data/menu.json'; // Veri dosyamız

const AksamScreen = () => {
    // Tarihleri alıp sıralıyoruz
    const dates = Object.keys(menuData).sort();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {dates.map((date) => {
                    const dayData = menuData[date];

                    // Sadece 'aksam' verisi olanları listeliyoruz
                    if (dayData && dayData.aksam) {
                        return (
                            <MealCard
                                key={date}
                                date={date}
                                items={dayData.aksam}
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
});

export default AksamScreen;