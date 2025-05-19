import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
//import * as DocumentPicker from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { collection, getDocs } from 'firebase/firestore';
import styles from './homeStyles';
import { auth, db } from './firebaseconfig';
import { Picker } from '@react-native-picker/picker';
import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import mime from 'mime';

export default function HomeScreen({ navigation, route }) {
  const { userName, userEmail } = route.params;
  const [documentos, setDocumentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const carregarDocumentos = async () => {
      const { data, error } = await supabase.from('documentos').select('*');

      if (error) {
        console.error('Erro ao carregar documentos:', error);
      } else {
        setDocumentos(data);
      }
    };

    carregarDocumentos();
  }, []);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      const fileUri = file.uri;
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const path = `documentos/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(path, blob, {
          contentType: blob.type,
        });

      if (uploadError) {
        console.error('Erro ao fazer upload:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('documentos')
        .getPublicUrl(path);

      const novoDoc = {
        nome: userName,
        tipo: blob.type,
        tamanho: (file.size / 1024).toFixed(2),
        uri: publicUrlData.publicUrl,
        status: 'Novo',
        arquivonome: file.name,
        data: new Date().toLocaleDateString(),
      };

      const { error: insertError } = await supabase
        .from('documentos')
        .insert([novoDoc]);

      if (insertError) {
        console.error('Erro ao salvar no Supabase:', insertError);
        return;
      }

      setDocumentos((prev) => [...prev, novoDoc]);
    }
  };

  const abrirDocumento = async (uri) => {
    await Linking.openURL(uri);
  };

  const filtrados = documentos.filter(
    (doc) =>
      doc.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (!filtro || doc.status.toLowerCase().includes(filtro.toLowerCase()))
  );

  const alternarStatus = async (item) => {
    const novosStatus = ['Novo', 'Em análise', 'Em andamento', 'Aprovado', 'Recusado'];
    const indexAtual = novosStatus.indexOf(item.status);
    const proximoStatus = novosStatus[(indexAtual + 1) % novosStatus.length];

    const { error } = await supabase
      .from('documentos')
      .update({ status: proximoStatus })
      .eq('id', item.id);

    if (error) {
      console.error('Erro ao atualizar status:', error);
      return;
    }

    setDocumentos((prev) =>
      prev.map((doc) =>
        doc.id === item.id ? { ...doc, status: proximoStatus } : doc
      )
    );
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.userText}>Olá, {userName}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout ↪</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtros}>
        <TextInput
          placeholder="Buscar..."
          placeholderTextColor="#aaa"
          style={styles.input}
          value={busca}
          onChangeText={setBusca}
        />
        <Picker
          selectedValue={filtro}
          onValueChange={(itemValue) => setFiltro(itemValue)}
          style={styles.input}>
          <Picker.Item label="Selecione a categoria" value="" />
          <Picker.Item label="Aprovado" value="aprovado" />
          <Picker.Item label="Em análise" value="em análise" />
          <Picker.Item label="Em andamento" value="em andamento" />
          <Picker.Item label="Recusado" value="recusado" />
          <Picker.Item label="Novo" value="novo" />
        </Picker>
      </View>

      {/* LISTA SCROLLÁVEL */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>Cliente: {item.nome}</Text>
              <Text style={styles.cardText}>Documento: {item.arquivonome}</Text>
              <Text style={styles.cardText}>Data: {item.data}</Text>
              <View style={styles.cardBottom}>
                <TouchableOpacity
                  onPress={() => alternarStatus(item)}
                  style={[
                    styles.status,
                    {
                      backgroundColor:
                            item.status === 'Aprovado'
                          ? '#2ecc71'
                          : item.status === 'Em análise'
                          ? '#f39c12'
                          : item.status === 'Recusado'
                          ? '#e74c3c'
                          : item.status === 'Em andamento'
                          ? '#3498db'
                          : '#95a5a6',
                    },
                  ]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => abrirDocumento(item.uri)}
                  style={styles.downloadButton}>
                  <Text style={styles.downloadText}>Baixar ↓</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* BOTÃO FIXO NO FINAL */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
          <Text style={styles.uploadText}>+ Selecionar Documento</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}