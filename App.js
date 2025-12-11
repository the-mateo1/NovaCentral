import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native'

import CampusEventsScreen from './CampusEventsScreen.js';
import AthleticsScreen from '../NovaCentral/AthleticsScreen';
import DiningScreen from './DiningScreen';
import MyNovaScreen from './MyNovaScreen.js';
import AcademicsScreen from './AcademicsScreen';
import CombinedEventsScreen from './CombinedEventsScreen.js';
import LoginScreen from './LoginScreen';
import ClassSchedule from './ClassSchedule.js';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

export default function App({ user }) {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}>

        <Tab.Screen name="Events" component={CombinedEventsScreen} />
        <Tab.Screen name="Dining" component={DiningScreen} />
        <Tab.Screen name="Home" component={ClassSchedule} />
        <Tab.Screen name="Academics" component={AcademicsScreen} />
        <Tab.Screen name="MyNova" component={MyNovaScreen} />

      </Tab.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}