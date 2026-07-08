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

const OPEN_W = 200;
const OPEN_H = 180;
const CLOSED = 44;

interface PlusMenuProps {
  onSelect: (tipo: string) => void;
}

export function PlusMenu({ onSelect }: PlusMenuProps) {
  const [open, setOpen] = useState(false);

  const width = useRef(new Animated.Value(CLOSED)).current;
  const height = useRef(new Animated.Value(CLOSED)).current;
  const radius = useRef(new Animated.Value(22)).current;
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
      Animated.timing(radius, { toValue: 22, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
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
    <Animated.View style={[styles.container, { width, height, borderRadius: radius }]}>
      {/* Menú desplegable */}
      <Animated.View style={[styles.menu, { opacity: menuOpacity }]} pointerEvents={open ? 'auto' : 'none'}>
        <Text style={styles.menuTitle}>Tipo de báscula</Text>
        {opciones.map((op) => (
          <TouchableOpacity
            key={op.value}
            style={styles.menuItem}
            onPress={() => {
              onSelect(op.value);
              closeMenu();
            }}
          >
            <Text style={styles.menuItemText}>{op.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Botón + */}
      <Animated.View style={[styles.plusBtn, { opacity: plusOpacity }]} pointerEvents={open ? 'none' : 'auto'}>
        <Pressable onPress={openMenu} style={styles.plusPressable}>
          <Animated.Text style={[styles.plusIcon, { transform: [{ rotate: spin }] }]}>+</Animated.Text>
        </Pressable>
      </Animated.View>

      {/* Overlay invisible para cerrar */}
      {open && (
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'flex-end',
  },
  plusBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusPressable: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
  menu: {
    position: 'absolute',
    inset: 0,
    padding: 14,
  },
  menuTitle: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  menuItem: {
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
