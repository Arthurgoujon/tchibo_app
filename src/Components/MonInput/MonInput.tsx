import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {makeThemedStyles} from '~/features/theme/theme';

export interface MonInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: boolean;
  helperText?: string;
  style?: MonInputStyle;
  icon?: () => React.ReactNode;
}

export interface MonInputStyle {
  labelStyle: TextStyle;
  inputContainerStyle: ViewStyle;
  inputStyle: TextStyle;
  helperTextStyle: TextStyle;
  containerStyle: ViewStyle;
}

export const MonInput: React.FC<MonInputProps> = (props) => {
  const {helperText, error, label, icon, ...inputProps} = props;
  const st = useStyle(props);
  return (
    <View style={st.containerStyle}>
      {!!label && <Text style={st.labelStyle}>{label}</Text>}
      <View style={[st.inputContainerStyle, error ? st.errorInput : null]}>
        <TextInput {...inputProps} style={st.inputStyle} />
        {icon && icon()}
      </View>
      {!!error && !!helperText && (
        <Text style={st.helperTextStyle}>{helperText}</Text>
      )}
    </View>
  );
};

const useStyle = makeThemedStyles((theme, props: MonInputProps) => {
  const styles = props.style || theme.monInputStyle;
  return {
    ...styles,
    errorInput: {
      borderBottomColor: 'red',
    },
  };
});
