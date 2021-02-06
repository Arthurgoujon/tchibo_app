import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {BasicButton} from '../Button/BasicButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {makeThemedStyles} from '~/features/theme/theme';

interface QuantityChooserProps {
  value: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const QuantityChooser = (props: QuantityChooserProps) => {
  const st = useStyles();
  const {onIncrement, onDecrement, value} = props;
  return (
    <View style={st.chooserPanel}>
      <BasicButton style={st.circleBtn} onActionPress={onDecrement}>
        {() => {
          return <Ionicons name={'remove-outline'} size={25} color={'white'} />;
        }}
      </BasicButton>
      <Text style={st.counterText}>{value}</Text>
      <BasicButton style={st.circleBtn} onActionPress={onIncrement}>
        {() => {
          return <Ionicons name={'add-outline'} size={25} color={'white'} />;
        }}
      </BasicButton>
    </View>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  chooserPanel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterText: {
    ...theme.mainFont,
    marginHorizontal: 45,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: 0.05,
  },
  circleBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: '#EDE4DE',
  },
}));
