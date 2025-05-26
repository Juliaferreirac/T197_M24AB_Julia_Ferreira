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
import * as DocumentPicker from 'expo-document-picker';
import styles from './homeStyles';
// import { auth } from './firebaseconfig'; // Removido se não estiver usando Firebase Auth para logout
import { supabase } from './supabase';
import DropDownPicker from 'react-native-dropdown-picker';

export default function HomeScreen({ navigation, route }) {
  const { userName, userEmail } = route.params;
  const [documentos, setDocumentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');
  const [open, setOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([
    { label: 'Todos', value: 'todos' },
    { label: 'Aprovado', value: 'aprovado' },
    { label: 'Em análise', value: 'em análise' },
    { label: 'Em andamento', value: 'em andamento' },
    { label: 'Recusado', value: 'recusado' },
    { label: 'Novo', value: 'novo' },
  ]);

  useEffect(() => {
    const carregarDocumentos = async () => {
      const { data, error } = await supabase.from('documentos').select('*');

      if (error) {
        console.error('Erro ao carregar documentos:', error);
      } else {
        setDocumentos(data || []);
      }
    };

    carregarDocumentos();
  }, []);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      const fileUri = file.uri;
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const path = `documentos/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(path, blob, {
          contentType: blob.type || file.mimeType || 'application/octet-stream',
        });

      if (uploadError) {
        console.error('Erro ao fazer upload:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('documentos')
        .getPublicUrl(path);

      if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error('Erro ao obter URL pública.');
          return;
      }

      const novoDoc = {
        nome: userName,
        tipo: blob.type || file.mimeType,
        tamanho: file.size ? (file.size / 1024).toFixed(2) : 'N/A',
        uri: publicUrlData.publicUrl,
        status: 'Novo',
        arquivonome: file.name,
        data: new Date().toISOString(),
      };

      const { data: insertedData, error: insertError } = await supabase
        .from('documentos')
        .insert([novoDoc])
        .select();

      if (insertError) {
        console.error('Erro ao salvar no Supabase:', insertError);
        return;
      }

      if (insertedData && insertedData.length > 0) {
        setDocumentos((prev) => [...prev, insertedData[0]]);
      } else {
        setDocumentos((prev) => [...prev, { ...novoDoc, id: Date.now().toString() }]);
      }
    }
  };

  const abrirDocumento = async (uri) => {
    try {
        const supported = await Linking.canOpenURL(uri);
        if (supported) {
            await Linking.openURL(uri);
        } else {
            console.error(`Não é possível abrir o link: ${uri}`);
        }
    } catch (error) {
        console.error('Erro ao tentar abrir o documento:', error);
    }
  };

  const filtrados = documentos.filter(
    (doc) =>
      doc.arquivonome?.toLowerCase().includes(busca.toLowerCase()) &&
      (!filtro || filtro.toLowerCase() === 'todos' || doc.status?.toLowerCase() === filtro.toLowerCase())
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
      const { error } = await supabase.auth.signOut();
      if (error) {
          console.error('Erro ao fazer logout no Supabase:', error);
          return;
      }
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro geral ao fazer logout:', error);
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) { 
      return 'N/A';
    }
    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
      return 'Data Inválida';
    }
    return dateObject.toLocaleDateString();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.userText}>Olá, {userName}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtros}>
        <TextInput
          placeholder="Buscar por nome do arquivo..."
          placeholderTextColor="#aaa"
          style={styles.input}
          value={busca}
          onChangeText={setBusca}
        />

        <DropDownPicker
          open={open}
          value={filtro}
          items={dropdownItems}
          setOpen={setOpen}
          setValue={setFiltro}
          setItems={setDropdownItems}
          placeholder="Selecione a categoria"
          containerStyle={{ marginTop: 10, zIndex: 1000 }}
          style={{ backgroundColor: '#fff', borderColor: '#ccc' }}
          dropDownContainerStyle={{ backgroundColor: '#eee' }}
          zIndex={1000}
          listMode="SCROLLVIEW"
        />
      </View>

      <View style={{ flex: 1, marginTop: open ? 200 : 10 }}>
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id?.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View style={styles.card}>
                <Text style={styles.cardText}>Cliente: {item.nome}</Text>
                <Text style={styles.cardText}>Documento: {item.arquivonome}</Text>
                <Text style={styles.cardText}>Data: {formatDisplayDate(item.data)}</Text>
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
            );
          }}
        />
      </View>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
          <Text style={styles.uploadText}>+ Selecionar Documento</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}