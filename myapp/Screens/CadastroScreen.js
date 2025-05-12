import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './Styles/cadastroStyles';
import { supabase } from './supabase';
import { auth, db } from './firebaseconfig';

export default function CadastroScreen({ navigation }) {
  const [text_nome, setText_nome] = useState('');
  const [text_email, setText_email] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const enviarCadastro = async () => {
    if (!text_nome || !text_email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: text_email,
      password: senha,
      options: {
        data: {
          nome: text_nome,
        },
      },
    });

    if (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    } else {
      Alert.alert(
        'Sucesso',
        'Cadastro realizado com sucesso!'
      );
      navigation.navigate('Login');
      setText_nome('');
      setText_email('');
      setSenha('');
      setConfirmarSenha('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Criar Conta</Text>
        <Image style={styles.imagem} source={require('./assets/sla.png')} />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            placeholder="Nome completo"
            style={styles.input}
            placeholderTextColor="#888"
            value={text_nome}
            onChangeText={setText_nome}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#888"
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#888"
            value={text_email}
            onChangeText={setText_email}
            keyboardType="email-address"
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
            placeholder="Senha"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
            value={senha}
            onChangeText={setSenha}
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
            placeholder="Confirmar senha"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={enviarCadastro}>
          <Text style={styles.loginButtonText}>Cadastrar</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Já tem uma conta?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation?.navigate('Login')}>
            Faça login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
