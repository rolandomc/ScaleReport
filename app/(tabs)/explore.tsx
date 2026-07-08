import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Accordion } from '@/components/ui/accordion';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Lecturas de referencia</Text>
        <Text style{styles.subtitle}>Tolerancias por tipo de báscula</Text>

        <Accordion title="🏗️  Báscula plataforma">
          <View style={styles.section}>
            <Row label="Excentricidad máx." value="0.5 div" />
            <Row label="Repetibilidad" value="0.5 div" />
            <Row label="Linealidad" value="1.0 div" />
            <Row label="Mínima carga" value="20 div" />
          </View>
        </Accordion>

        <Accordion title="🚛  Báscula camionera">
          <View style={styles.section}>
            <Row label="Excentricidad frontal/trasera" value="0.5 div" />
            <Row label="Excentricidad izq/der" value="0.5 div" />
            <Row label="Repetibilidad" value="1.0 div" />
            <Row label="Linealidad" value="1.0 div" />
          </View>
        </Accordion>

        <Accordion title="🚂  Báscula ferrocarrilera">
          <View style={styles.section}>
            <Row label="Excentricidad eje 1/2" value="1.0 div" />
            <Row label="Repetibilidad" value="1.0 div" />
            <Row label="Linealidad" value="2.0 div" />
            <Row label="Carga máxima" value="Per diseño" />
          </View>
        </Accordion>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d0d1a' },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#666', fontSize: 13, marginBottom: 24 },
  section: { paddingHorizontal: 16, paddingBottom: 14, paddingTop: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a2a4a',
  },
  rowLabel: { color: '#bbb', fontSize: 13, flex: 1 },
  rowValue: { color: '#7ec8e3', fontSize: 13, fontWeight: '600' },
});
