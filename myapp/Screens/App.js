import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Importação das telas
import TelaCadastro from './CadastroScreen';
import TelaLogin from './LoginScreen';
import TelaHome from './HomeScreen'
// Criação do Stack Navigator
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={TelaLogin} />
        <Stack.Screen name="Cadastro" component={TelaCadastro} />
        <Stack.Screen name="Home" component={TelaHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
