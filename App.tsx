import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LoginScreen, RegisterScreen, UserTypeScreen, CompanyAuthScreen } from './src/screens/auth';
import { DashboardScreen } from './src/screens/dashboard';
import { RankingScreen } from './src/screens/ranking';
///import { RewardsScreen } from './src/screens/rewards';
import { RecycleScreen, CollectionStatusScreen } from './src/screens/collections';
import { CollectorScreen } from './src/screens/collectors';
import { ProfileScreen } from './src/screens/profile';
import { CompanyRegisterScreen } from './src/screens/company';
import { BenefitsRegisterScreen } from './src/screens/benefits';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './src/contexts/ThemeContext';

// TODO: Implementar autenticação persistente
// TODO: Adicionar splash screen
// TODO: Implementar deep linking
// TODO: Adicionar analytics e crash reporting

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
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
          <Stack.Screen name="CompanyAuth" component={CompanyAuthScreen} />
          <Stack.Screen name="Collector" component={CollectorScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Ranking" component={RankingScreen}/>
          <Stack.Screen name="Recycle" component={RecycleScreen}/>
          <Stack.Screen name="CollectionStatus" component={CollectionStatusScreen}/>
          {/* TODO: Reativar recompensas no futuro */}
          {/* <Stack.Screen name="Rewards" component={RewardsScreen}/> */}
          <Stack.Screen name="Profile" component={ProfileScreen}/>
          <Stack.Screen name="CompanyRegister" component={CompanyRegisterScreen}/>
          <Stack.Screen name="BenefitsRegister" component={BenefitsRegisterScreen}/>
          
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
