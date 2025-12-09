import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native'

import EventsScreen from '../NovaCentral/EventsScreen';
import AthleticsScreen from '../NovaCentral/AthleticsScreen';
import DiningScreen from './DiningScreen';
import MyNovaScreen from './MyNovaScreen.js';
import AcademicsScreen from './AcademicsScreen';


import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}>

        <Tab.Screen name="Athletics" component={AthleticsScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Dining" component={DiningScreen} />
        <Tab.Screen name="MyNova" component={MyNovaScreen} />
        <Tab.Screen name="Academics" component={AcademicsScreen} />

      </Tab.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}