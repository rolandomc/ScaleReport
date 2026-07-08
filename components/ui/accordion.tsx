import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export function Accordion({ title, children }: AccordionProps) {
  const [open, setOpen] = useState(false);
  const [measured, setMeasured] = useState(0);
  const animHeight = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const chevronRotate = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toHeight = open ? 0 : measured;
    const toOpacity = open ? 0 : 1;
    const toRotate = open ? 0 : 1;
    Animated.parallel([
      Animated.timing(animHeight, {
        toValue: toHeight,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: toOpacity,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(chevronRotate, {
        toValue: toRotate,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    setOpen((v) => !v);
  };

  const spin = chevronRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.header} onPress={toggle} accessibilityRole="button" accessibilityState={{ expanded: open }}>
        <Text style={styles.headerText}>{title}</Text>
        <Animated.Text style={[styles.chevron, { transform: [{ rotate: spin }] }]}>⌄</Animated.Text>
      </Pressable>

      <Animated.View style={[styles.panel, { height: measured === 0 ? undefined : animHeight }]}>
        <View
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && measured === 0) {
              setMeasured(h);
              animHeight.setValue(0);
            }
          }}
          style={measured === 0 ? styles.measureHidden : undefined}
        >
          <Animated.View style={{ opacity }}>
            {children}
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerText: {
    color: '#e0e0e0',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  chevron: {
    color: '#aaa',
    fontSize: 18,
    lineHeight: 20,
  },
  panel: {
    overflow: 'hidden',
  },
  measureHidden: {
    position: 'absolute',
    opacity: 0,
  },
});
