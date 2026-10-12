import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme/theme';

export function Avatar({ uri, initials, size = 40 }: { uri?: string; initials: string; size?: number }) {
  const shape = { width: size, height: size, borderRadius: size / 2 };
  if (uri) return <Image source={{ uri }} style={[shape, styles.img]} accessibilityIgnoresInvertColors />;
  return (
    <View style={[shape, styles.fallback]}>
      <Text style={[styles.text, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  img: { backgroundColor: colors.navy700 },
  fallback: { backgroundColor: colors.berry, alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: fonts.bold, color: colors.white },
});
