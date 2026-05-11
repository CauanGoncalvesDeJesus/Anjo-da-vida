import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Keyboard, SafeAreaView, StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

export default function App() {
  const [appPronto, setAppPronto] = useState(false);
  const [relato, setRelato] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  async function tocarSom() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/buttons/sounds/button-10.mp3' }
      );
      await sound.playAsync();
    } catch (e) { console.log("Erro som:", e); }
  }

  const analisarIA = () => {
    if (!relato.trim()) return alert("Descreva a situação.");

    setLoading(true);
    setResultado(null);
    Keyboard.dismiss();

    setTimeout(async () => {
      const texto = relato.toLowerCase();
      let analise = {
        gravidade: 2,
        status: 'ESTÁVEL (VERDE)',
        cor: '#27ae60',
        icone: 'check-circle-outline',
        detalhes: 'Sintomas leves detectados.',
        primeirosSocorros: 'Mantenha a vítima calma e aguarde atendimento.'
      };

      if (texto.includes('sangue') || texto.includes('hemorragia') || texto.includes('corte profundo')) {
        analise = {
          gravidade: 7, status: 'URGENTE (AMARELO)', cor: '#f39c12', icone: 'alert-circle',
          detalhes: 'Risco de perda sanguínea significativa.',
          primeirosSocorros: 'Aplique pressão direta sobre a ferida com pano limpo. Não remova objetos cravados.'
        };
      }

      if (texto.includes('peito') || texto.includes('respirar') || texto.includes('ar') || texto.includes('enfarto')) {
        analise = {
          gravidade: 10, status: 'EMERGÊNCIA (VERMELHO)', cor: '#e74c3c', icone: 'heart-flash',
          detalhes: 'Possível insuficiência cardiorrespiratória.',
          primeirosSocorros: 'Afrouxe as roupas. Se inconsciente, inicie compressões torácicas (RCP).'
        };
      }

      if (texto.includes('desmai') || texto.includes('acorda') || texto.includes('inconsciente')) {
        analise = {
          gravidade: 9, status: 'CRÍTICO (VERMELHO)', cor: '#c0392b', icone: 'skull-scan',
          detalhes: 'Vítima não responsiva.',
          primeirosSocorros: 'Verifique a respiração. Coloque a vítima de lado (posição de segurança).'
        };
      }

      setResultado(analise);
      setLoading(false);
      await tocarSom();
    }, 2000);
  };

  if (!appPronto) {
    return (
      <LinearGradient colors={['#D32F2F', '#8B0000']} style={styles.splashContainer}>
        <StatusBar barStyle="light-content" />
        <View>
          <MaterialCommunityIcons name="shield-cross" size={120} color="#FFF" />
        </View>
        <Text style={styles.splashTitle}>ANJO DA VIDA</Text>
        <Text style={styles.splashTagline}>Triagem com Inteligência Artificial</Text>
        <TouchableOpacity style={styles.startBtn} onPress={() => setAppPronto(true)}>
          <Text style={styles.startBtnText}>ACESSAR SISTEMA</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setAppPronto(false)}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Triagem</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.label}>O que está acontecendo?</Text>
          <TextInput
            style={styles.input}
            placeholder="Descreva aqui os sinais e sintomas da vítima..."
            multiline
            value={relato}
            onChangeText={setRelato}
          />

          <TouchableOpacity
            style={[styles.mainBtn, loading && { opacity: 0.7 }]}
            onPress={analisarIA}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : (
              <Text style={styles.mainBtnText}>ANALISAR AGORA</Text>
            )}
          </TouchableOpacity>
        </View>

        {resultado && (
          <View style={[styles.card, { borderLeftColor: resultado.cor }]}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name={resultado.icone} size={32} color={resultado.cor} />
              <Text style={[styles.statusTxt, { color: resultado.cor }]}>{resultado.status}</Text>
            </View>

            <Text style={styles.detailTitle}>Análise Técnica:</Text>
            <Text style={styles.detailBody}>{resultado.detalhes}</Text>

            <View style={styles.divider} />

            <Text style={styles.socorroTitle}>Primeiros Socorros Sugeridos:</Text>
            <View style={styles.socorroBox}>
               <Text style={styles.socorroBody}>{resultado.primeirosSocorros}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  splashTitle: { color: '#FFF', fontSize: 38, fontWeight: '900', marginTop: 10 },
  splashTagline: { color: '#FFCDD2', fontSize: 16, marginBottom: 40 },
  startBtn: { backgroundColor: '#FFF', paddingVertical: 18, paddingHorizontal: 50, borderRadius: 50, elevation: 5 },
  startBtnText: { color: '#D32F2F', fontWeight: '800', fontSize: 16 },

  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#555', marginBottom: 10 },
  input: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, fontSize: 16, height: 120, textAlignVertical: 'top', elevation: 2 },
  mainBtn: { backgroundColor: '#D32F2F', marginTop: 20, padding: 20, borderRadius: 15, alignItems: 'center', elevation: 3 },
  mainBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  card: { backgroundColor: '#FFF', marginTop: 25, borderRadius: 15, padding: 20, borderLeftWidth: 8, elevation: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  statusTxt: { fontSize: 18, fontWeight: '900', marginLeft: 10 },
  detailTitle: { fontSize: 14, fontWeight: 'bold', color: '#777' },
  detailBody: { fontSize: 16, color: '#333', marginBottom: 15 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  socorroTitle: { fontSize: 14, fontWeight: 'bold', color: '#D32F2F', marginBottom: 5 },
  socorroBox: { backgroundColor: '#FFEBEE', padding: 15, borderRadius: 10 },
  socorroBody: { fontSize: 15, color: '#B71C1C', fontStyle: 'italic', lineHeight: 22 }
});