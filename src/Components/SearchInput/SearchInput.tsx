import React from 'react';
import {Text, TextInput, TextInputProps, TextStyle, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {makeThemedStyles} from '~/features/theme/theme';
export interface SearchInputProps extends TextInputProps {
  containerStyle?: TextStyle;
  renderIcon: () => React.ReactNode;
  onPress?: () => void;
  dropDown?: boolean;
}

export const SearchInput = (props: SearchInputProps) => {
  const st = useStyles();
  const {containerStyle, dropDown, onPress, ...other} = props;

  if (dropDown) {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[st.input, containerStyle]}>
          {props.renderIcon && (
            <View style={st.iconWrapper}>{props.renderIcon()}</View>
          )}
          <Text
            numberOfLines={1}
            style={props.value ? st.textInput : st.dropdownText}
            {...other}>
            {props.value || props.placeholder}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return (
    <View style={[st.input, containerStyle]}>
      {props.renderIcon && (
        <View style={st.iconWrapper}>{props.renderIcon()}</View>
      )}
      <TextInput
        placeholderTextColor={st.dropdownText.color}
        style={st.textInput}
        {...other}
      />
    </View>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  input: {
    flexDirection: 'row',
    height: 47,
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 17,
    borderRadius: 70,
    borderColor: 'rgba(0, 0, 0, 0.35)',
    marginBottom: theme.spacing(1),
  },
  iconWrapper: {
    height: '50%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logo: {},
  textInput: {
    ...theme.inputTextStyle,
    flex: 1,
  },
  dropdownText: {
    color: '#818181',
    lineHeight: 18,
  },
}));
