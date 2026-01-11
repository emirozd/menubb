import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons'; // Expo içinde hazır gelen ikon paketi

// Ekranlarımızı içe aktarıyoruz
import SabahScreen from './src/screens/SabahScreen';
import AksamScreen from './src/screens/AksamScreen';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            {/* Üstteki saat/pil göstergesini otomatik ayarlar */}
            <StatusBar style="dark" />

            <Tab.Navigator
                screenOptions={({ route }) => ({
                    // Sekme İkonlarını Ayarlama
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Sabah Menüsü') {
                            // Sabah sekmesi için güneş/kahve ikonu
                            iconName = focused ? 'sunny' : 'sunny-outline';
                        } else if (route.name === 'Akşam Menüsü') {
                            // Akşam sekmesi için ay/yemek ikonu
                            iconName = focused ? 'moon' : 'moon-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#e91e63', // Seçili sekme rengi
                    tabBarInactiveTintColor: 'gray',  // Pasif sekme rengi
                    headerTitleAlign: 'center',       // Başlığı ortala
                })}
            >
                <Tab.Screen
                    name="Sabah Menüsü"
                    component={SabahScreen}
                    options={{ title: 'Kahvaltı Listesi' }}
                />
                <Tab.Screen
                    name="Akşam Menüsü"
                    component={AksamScreen}
                    options={{ title: 'Akşam Yemeği Listesi' }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}