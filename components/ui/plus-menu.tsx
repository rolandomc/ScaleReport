import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const OPEN_W = 220;
const OPEN_H = 200;
const CLOSED = 64;

interface PlusMenuProps {
  onSelect: (tipo: string) => void;
}

export function PlusMenu({ onSelect }: PlusMenuProps) {
  const [open, setOpen] = useState(false);

  const width = useRef(new Animated.Value(CLOSED)).current;
  const height = useRef(new Animated.Value(CLOSED)).current;
  const radius = useRef(new Animated.Value(32)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const plusOpacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setOpen(true);
    Animated.parallel([
      Animated.timing(width, { toValue: OPEN_W, duration: 350, easing: Easing.out(Easing.back(1.4)), useNativeDriver: false }),
      Animated.timing(height, { toValue: OPEN_H, duration: 350, easing: Easing.out(Easing.back(1.4)), useNativeDriver: false }),
      Animated.timing(radius, { toValue: 20, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(menuOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(plusOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 1, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(width, { toValue: CLOSED, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(height, { toValue: CLOSED, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(radius, { toValue: 32, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(menuOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(plusOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 0, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start(() => setOpen(false));
  };

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  const opciones = [
    { label: '🏗️  Plataforma', value: 'plataforma' },
    { label: '🚛  Camionera', value: 'camionera' },
    { label: '🚂  Ferrocarrilera', value: 'ferrocarrilera' },
  ];

  return (
    <View style={styles.wrapper}>
      {/* Overlay para cerrar — DETRÁS de todo */}
      {open && (
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
      )}

      <Animated.View style={[styles.container, { width, height, borderRadius: radius }]}>
        {/* Menú desplegable */}
        {open && (
          <Animated.View style={[styles.menu, { opacity: menuOpacity }]} pointerEvents="auto">
            <Text style={styles.menuTitle}>Tipo de báscula</Text>
            {opciones.map((op) => (
              <TouchableOpacity
                key={op.value}
                style={styles.menuItem}
                activeOpacity={0.6}
                onPress={() => {
                  onSelect(op.value);
                  closeMenu();
                }}
              >
                <Text style={styles.menuItemText}>{op.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Botón + — siempre visible cuando cerrado */}
        {!open && (
          <Animated.View style={[styles.plusBtn, { opacity: plusOpacity }]}>
            <Pressable onPress={openMenu} style={styles.plusPressable} android_ripple={{ color: '#ffffff33', radius: 32 }}>
              <Animated.Text style={[styles.plusIcon, { transform: [{ rotate: spin }] }]}>+</Animated.Text>
            </Pressable>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-end',
  },
  container: {
    backgroundColor: '#0a7ea4',
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'flex-end',
    elevation: 8,
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  plusBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusPressable: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 40,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  menu: {
    position: 'absolute',
    inset: 0,
    padding: 16,
  },
  menuTitle: {
    color: '#e0f4ff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
