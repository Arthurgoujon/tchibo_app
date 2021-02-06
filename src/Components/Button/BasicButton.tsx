import React, {ReactNode, useState} from 'react';
import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  PressableStateCallbackType,
  TextStyle,
} from 'react-native';

interface ButtonChildrenProp {
  isPressed: boolean;
  isLoading: boolean;
}

interface BasicButtonProp {
  children: (state: ButtonChildrenProp) => ReactNode;
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
  onActionPress: () => void;
}

export const BasicButton = React.memo(
  ({onActionPress, style, children}: BasicButtonProp) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
      <Pressable
        disabled={isLoading}
        onPress={async () => {
          try {
            setIsLoading(true);
            await Promise.resolve(onActionPress());
          } finally {
            setIsLoading(false);
          }
        }}
        style={(pressState) => [
          st.actionbtn,
          {
            opacity: pressState.pressed || isLoading ? 0.6 : 1,
          },
          style instanceof Function ? style(pressState) : style,
        ]}>
        {({pressed}) => {
          return children({isLoading, isPressed: pressed});
        }}
      </Pressable>
    );
  },
);

const st = StyleSheet.create({
  actionbtn: {},
});
