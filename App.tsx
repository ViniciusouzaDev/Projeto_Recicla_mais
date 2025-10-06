import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LoginScreen, RegisterScreen, UserTypeScreen } from './src/screens/auth';
import { DashboardScreen } from './src/screens/dashboard';
import { RankingScreen } from './src/screens/ranking';
import { RewardsScreen } from './src/screens/rewards';
import { RecycleScreen } from './src/screens/collections';
import { CollectorRegisterScreen, CollectorScreen } from './src/screens/collectors';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="UserType" component={UserTypeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CollectorRegister" component={CollectorRegisterScreen} />
        <Stack.Screen name="Collector" component={CollectorScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Ranking" component={RankingScreen}/>
        <Stack.Screen name="Recycle" component={RecycleScreen}/>
        <Stack.Screen name="Rewards" component={RewardsScreen}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
