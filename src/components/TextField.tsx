import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { Icon } from './Icon';
import { IconName } from '../theme/glyphs';
import { colors, fonts } from '../theme/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  icon?: IconName;
  error?: string | null;
  /** Adds a show/hide toggle and hides the value by default. */
  password?: boolean;
  disabled?: boolean;
  ref?: React.Ref<TextInput>;
}

export function TextField({ label, icon, error, password, disabled, style, ref, ...input }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.box,
          focused && styles.boxFocused,
          error ? styles.boxError : null,
          disabled && styles.boxDisabled,
        ]}>
        {icon && <Icon name={icon} size={19} color={focused ? colors.blue : colors.textMuted2} />}
        <TextInput
          ref={ref}
          {...input}
          editable={!disabled}
          secureTextEntry={password ? hidden : input.secureTextEntry}
          placeholderTextColor={colors.textMuted2}
          onFocus={(e) => {
            setFocused(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            input.onBlur?.(e);
          }}
          style={[styles.input, disabled && { color: colors.disabledText }, style]}
        />
        {password && (
          <Pressable
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((h) => !h)}>
            <Icon name={hidden ? 'visibility_off' : 'visibility'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 7 },
  label: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.ink },
  box: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    borderRadius: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  boxFocused: { borderColor: colors.blue, backgroundColor: colors.white },
  boxError: { borderColor: colors.red },
  boxDisabled: { backgroundColor: colors.bg },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.ink,
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  error: { fontSize: 12, fontFamily: fonts.medium, color: colors.red },
});
