import React, {useState} from 'react';
import {
  Text,
  Pressable,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  ActivityIndicatorProps,
} from 'react-native';
import {makeThemedStyles} from '~/features/theme/theme';

interface MonButtonProp {
  text: string;
  style?: MonButtonStyle;
  onActionPress: () => void;
  icon?: () => React.ReactNode;
}

export interface MonButtonStyle {
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: TextStyle;
  actIndStyle?: {
    indicator: Pick<ActivityIndicatorProps, 'size' | 'color'>;
    style: ViewStyle;
  };
}

export const MonButton: React.FC<MonButtonProp> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const st = useStyle(props);
  const {text, onActionPress} = props;

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
        {
          opacity: pressState.pressed || isLoading ? 0.6 : 1,
        },
      ]}>
      {isLoading ? (
        <View style={st.buttonStyle}>
          <ActivityIndicator
            style={st.actIndStyle?.style}
            size={st.actIndStyle?.indicator?.size || 'small'}
            color={st.actIndStyle?.indicator?.color || 'white'}
          />
        </View>
      ) : (
        <View style={[st.buttonStyle]}>
          <View>{props.icon && props.icon()}</View>
          <Text style={[st.textStyle]}>{text}</Text>
        </View>
      )}
    </Pressable>
  );
};

const useStyle = makeThemedStyles((_theme, props: MonButtonProp) => {
  const styles = props.style || ({} as MonButtonStyle);
  return {
    ...styles,
  };
});
