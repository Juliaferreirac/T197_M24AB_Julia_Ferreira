import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './Styles/loginStyles';
import { supabase } from './supabase';
import { auth, db } from './firebaseconfig';
import firebase from 'firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false); // 👁️

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      console.error(error);
      Alert.alert('Erro', 'Email ou senha inválidos.');
    } else {
      const user = data.user;
      const nome = user.user_metadata?.nome || 'Usuário';
      navigation.navigate('Home', { userName: nome, userEmail: email });
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Image style={styles.imagem} source={require('./assets/sla.png')} />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            placeholder="Digite seu email"
            style={styles.input}
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            placeholder="Digite sua senha"
            secureTextEntry={!mostrarSenha}
            style={styles.input}
            placeholderTextColor="#888"
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity
            onPress={() => setMostrarSenha(!mostrarSenha)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={mostrarSenha ? 'eye-off' : 'eye'}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>Somente administradores autorizados</Text>

        <Text style={styles.registerText}>
          Não possui login?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation?.navigate('Cadastro')}>
            Faça seu cadastro
          </Text>
        </Text>
      </View>
    </View>
  );
}
