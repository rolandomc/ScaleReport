import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { PlusMenu } from '@/components/ui/plus-menu';
import { Accordion } from '@/components/ui/accordion';

type TipoBascula = 'plataforma' | 'camionera' | 'ferrocarrilera' | null;

interface Reporte {
  id: string;
  tipo: TipoBascula;
  fecha: string;
  puntos: { etiqueta: string; valor: string }[];
}

export default function HomeScreen() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoBascula>(null);
  const [creando, setCreando] = useState(false);
  const [nuevoPunto, setNuevoPunto] = useState({ etiqueta: '', valor: '' });
  const [puntosTemp, setPuntosTemp] = useState<{ etiqueta: string; valor: string }[]>([]);

  const etiquetasTipo: Record<string, string[]> = {
    plataforma: ['Excentricidad Eje X', 'Excentricidad Eje Y', 'Repetibilidad', 'Linealidad', 'Mínima carga'],
    camionera: ['Excentricidad Frontal', 'Excentricidad Trasera', 'Excentricidad Izq', 'Excentricidad Der', 'Repetibilidad', 'Linealidad'],
    ferrocarrilera: ['Excentricidad Eje 1', 'Excentricidad Eje 2', 'Repetibilidad', 'Linealidad', 'Carga máxima'],
  };

  const iniciarCreacion = (tipo: string) => {
    setTipoSeleccionado(tipo as TipoBascula);
    setPuntosTemp([]);
    setCreando(true);
  };

  const agregarPunto = () => {
    if (!nuevoPunto.etiqueta.trim()) return;
    setPuntosTemp((prev) => [...prev, { ...nuevoPunto }]);
    setNuevoPunto({ etiqueta: '', valor: '' });
  };

  const guardarReporte = () => {
    if (!tipoSeleccionado) return;
    const reporte: Reporte = {
      id: Date.now().toString(),
      tipo: tipoSeleccionado,
      fecha: new Date().toLocaleString('es-MX'),
      puntos: puntosTemp,
    };
    setReportes((prev) => [reporte, ...prev]);
    setCreando(false);
    setTipoSeleccionado(null);
    setPuntosTemp([]);
  };

  const cancelar = () => {
    setCreando(false);
    setTipoSeleccionado(null);
    setPuntosTemp([]);
  };

  const iconoTipo: Record<string, string> = {
    plataforma: '🏗️',
    camionera: '🚛',
    ferrocarrilera: '🚂',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ScaleReport</Text>
          <Text style={styles.subtitle}>Reportes de báscula</Text>
        </View>

        {/* Formulario de nuevo reporte */}
        {creando && tipoSeleccionado && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {iconoTipo[tipoSeleccionado]}  Nuevo reporte — {tipoSeleccionado}
            </Text>

            {/* Sugerencias de etiquetas */}
            <Text style={styles.sectionLabel}>Lecturas sugeridas</Text>
            <View style={styles.chipRow}>
              {etiquetasTipo[tipoSeleccionado].map((et) => (
                <TouchableOpacity
                  key={et}
                  style={styles.chip}
                  onPress={() => setNuevoPunto((p) => ({ ...p, etiqueta: et }))}
                >
                  <Text style={styles.chipText}>{et}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Añadir punto */}
            <Text style={styles.sectionLabel}>Añadir punto de lectura</Text>
            <TextInput
              style={styles.input}
              placeholder="Etiqueta (ej. Excentricidad Eje X)"
              placeholderTextColor="#666"
              value={nuevoPunto.etiqueta}
              onChangeText={(t) => setNuevoPunto((p) => ({ ...p, etiqueta: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Valor (ej. 0.023 kg)"
              placeholderTextColor="#666"
              value={nuevoPunto.valor}
              onChangeText={(t) => setNuevoPunto((p) => ({ ...p, valor: t }))}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.btnSecondary} onPress={agregarPunto}>
              <Text style={styles.btnSecondaryText}>+ Añadir punto</Text>
            </TouchableOpacity>

            {/* Puntos agregados */}
            {puntosTemp.length > 0 && (
              <View style={styles.puntosContainer}>
                {puntosTemp.map((p, i) => (
                  <View key={i} style={styles.puntoRow}>
                    <Text style={styles.puntoLabel}>{p.etiqueta}</Text>
                    <Text style={styles.puntoValor}>{p.valor}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Acciones */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnCancel} onPress={cancelar}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={guardarReporte}>
                <Text style={styles.btnPrimaryText}>Guardar reporte</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Lista de reportes */}
        {reportes.length === 0 && !creando && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Sin reportes aún</Text>
            <Text style={styles.emptyHint}>Usa el botón + para crear uno</Text>
          </View>
        )}

        {reportes.map((r) => (
          <Accordion
            key={r.id}
            title={`${iconoTipo[r.tipo ?? '']}  ${r.tipo?.toUpperCase()} — ${r.fecha}`}
          >
            <View style={styles.accordionContent}>
              {r.puntos.length === 0 ? (
                <Text style={styles.noPuntos}>Sin lecturas registradas</Text>
              ) : (
                r.puntos.map((p, i) => (
                  <View key={i} style={styles.puntoRow}>
                    <Text style={styles.puntoLabel}>{p.etiqueta}</Text>
                    <Text style={styles.puntoValor}>{p.valor}</Text>
                  </View>
                ))
              )}
            </View>
          </Accordion>
        ))}
      </ScrollView>

      {/* FAB PlusMenu */}
      {!creando && (
        <View style={styles.fab}>
          <PlusMenu onSelect={iniciarCreacion} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  sectionLabel: {
    color: '#888',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#2a2a4a',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#444',
  },
  chipText: {
    color: '#ccc',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#111128',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  btnSecondaryText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  puntosContainer: {
    backgroundColor: '#111128',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  puntoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a2a4a',
  },
  puntoLabel: {
    color: '#bbb',
    fontSize: 13,
    flex: 1,
  },
  puntoValor: {
    color: '#7ec8e3',
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnCancelText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  btnPrimary: {
    flex: 2,
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#555',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyHint: {
    color: '#444',
    fontSize: 13,
    marginTop: 8,
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 4,
  },
  noPuntos: {
    color: '#555',
    fontSize: 13,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
  },
});
