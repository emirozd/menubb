import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MealCard = ({ date, items }) => {
    // Tarihi daha okunabilir formata çevirmek için basit bir işlem (Opsiyonel)
    // Örn: 2026-01-01 -> 01.01.2026
    const formattedDate = date.split('-').reverse().join('.');

    return (
        <View style={styles.cardContainer}>
            {/* Tarih Başlığı */}
            <View style={styles.header}>
                <Text style={styles.dateText}>{formattedDate}</Text>
            </View>

            {/* Yemek Listesi */}
            <View style={styles.content}>
                {items && items.length > 0 ? (
                    items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.categoryText}>{item.category}</Text>
                                <Text style={styles.foodName}>{item.name}</Text>
                            </View>
                            <View style={styles.calorieContainer}>
                                <Text style={styles.calorieText}>{item.calories} cal</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Bu öğün için veri yok.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 10,
        marginHorizontal: 16,
        // Gölge ayarları (iOS ve Android için)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden', // İçerik taşarsa köşeleri kessin
    },
    header: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 15,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    itemInfo: {
        flex: 1,
        marginRight: 10,
    },
    categoryText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    foodName: {
        fontSize: 15,
        color: '#444',
        fontWeight: '600',
    },
    calorieContainer: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    calorieText: {
        fontSize: 12,
        color: '#1565c0',
        fontWeight: 'bold',
    },
    emptyText: {
        fontStyle: 'italic',
        color: '#999',
        textAlign: 'center',
    },
});

export default MealCard;