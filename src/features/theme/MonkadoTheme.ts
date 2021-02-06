import {StackNavigationOptions} from '@react-navigation/stack';
import {ColorValue, TextStyle} from 'react-native';
import {MonButtonStyle} from '~/Components/Button/MonButton';
import {MonInputStyle} from '~/Components/MonInput/MonInput';

export interface MonkadoTheme {
  spacing: (num?: number) => number;
  mainColor: ColorValue;
  backGroundColor: string;
  primaryColor1: string;
  secondaryColor: string;
  productCardTitleFont: TextStyle;
  productCardPriceFont: TextStyle;
  inputTextStyle: TextStyle;
  mainFont: TextStyle;
  kadoCardMaxWidth: number;
  distanceFromScreenEdges: number;
  headerTitle: TextStyle;

  // this is style for navigation stack card
  stackCardStyle: Pick<
    StackNavigationOptions,
    'headerTitleStyle' | 'headerStyle' | 'cardStyle' | 'headerTitleAlign' | 'headerBackTitleVisible'
  >;

  // secodary color Button style

  primaryBtnStyle: MonButtonStyle;
  secondaryBtnStyle: MonButtonStyle;
  outlineBtnStyle: MonButtonStyle;
  socialBtnStyle: MonButtonStyle;
  monInputStyle: MonInputStyle;
  monInputRoundedStyle: MonInputStyle;
}
