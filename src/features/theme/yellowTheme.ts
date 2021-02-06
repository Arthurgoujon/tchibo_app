import {TextStyle} from 'react-native';
import {MonkadoTheme} from './MonkadoTheme';

export const useYellowTheme = () => {
  const mainbackGroundColor = '#FFFFFF';
  const primaryColor1 = '#013976';
  const secondaryColor = '#FF3333';

  const mainFont: TextStyle = {
    fontFamily: 'Raleway-Light',
    fontStyle: 'normal',
  };

  const labelStyle: TextStyle = {
    ...mainFont,
    fontSize: 14,
    color: '#B4B4B4',
  };

  const spacing = (num?: number) => {
    if (!num || num <= 0) {
      return 0;
    }
    return num * 8;
  };

  const headerTitle: TextStyle = {
    fontFamily: 'Gloria Hallelujah',
    color: primaryColor1,
    fontSize: 20,
    alignSelf: 'center',
  };

  const theme: MonkadoTheme = {
    spacing,
    mainColor: '#013976',
    backGroundColor: mainbackGroundColor,
    productCardTitleFont: {
      fontFamily: 'Raleway-Light',
      fontStyle: 'normal',
      fontSize: 21,
      // lineHeight: 25,
      color: '#000000',
    },
    productCardPriceFont: {
      fontFamily: 'Raleway-Light',
      fontStyle: 'normal',
      fontSize: 16,
      lineHeight: 19,
      color: '#000000',
    },
    inputTextStyle: {
      ...mainFont,
      fontSize: 14,
      lineHeight: 18,
      color: '#000000',
    },
    primaryColor1,
    secondaryColor,
    kadoCardMaxWidth: 500,
    distanceFromScreenEdges: 20,

    stackCardStyle: {
      headerTitleStyle: headerTitle,
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
      headerStyle: {
        elevation: 0,
        backgroundColor: mainbackGroundColor,
      },
      cardStyle: {
        backgroundColor: mainbackGroundColor,
      },
    },
    headerTitle,
    primaryBtnStyle: {
      buttonStyle: {
        flexDirection: 'row',
        backgroundColor: primaryColor1,
        justifyContent: 'center',
        borderRadius: 42,
        paddingVertical: 15,
        paddingHorizontal: 39,
      },
      textStyle: {
        color: '#FFFFFF',
        fontFamily: 'Raleway-Light',
        fontStyle: 'normal',
        fontSize: 19,
        lineHeight: 22,
      },
    },

    secondaryBtnStyle: {
      buttonStyle: {
        flexDirection: 'row',
        backgroundColor: secondaryColor,
        justifyContent: 'center',
        borderRadius: 42,
        paddingVertical: 15,
        paddingHorizontal: 39,
      },
      textStyle: {
        color: '#FFFFFF',
        fontFamily: 'Raleway-Light',
        fontStyle: 'normal',
        fontSize: 19,
        lineHeight: 22,
      },
    },

    outlineBtnStyle: {
      buttonStyle: {
        borderRadius: 42,
        borderWidth: 1,
        borderColor: '#333333',
        paddingVertical: 15,
        paddingHorizontal: 39,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      textStyle: {
        color: '#333333',
        ...mainFont,
        fontSize: 19,
        lineHeight: 22,
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
      },
    },

    socialBtnStyle: {
      buttonStyle: {
        borderRadius: 42,
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.25)',
        paddingVertical: 9,
        paddingHorizontal: 39,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 52,
      },
      actIndStyle: {
        style: {
          flex: 1,
        },
        indicator: {
          size: 'small',
          color: primaryColor1,
        },
      },
      textStyle: {
        color: primaryColor1,
        ...mainFont,
        fontSize: 15,
        lineHeight: 17,
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
      },
    },

    monInputStyle: {
      labelStyle: labelStyle,
      inputStyle: {
        ...mainFont,
        flex: 1,
        fontSize: 15,
        color: '#333333',
        paddingVertical: 9,
      },
      inputContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#1D2D50',
        borderBottomWidth: 1,
      },
      helperTextStyle: {
        color: '#FF3333',
        marginTop: spacing(1),
      },
      containerStyle: {
        marginBottom: spacing(1),
      },
    },

    monInputRoundedStyle: {
      labelStyle: labelStyle,
      inputStyle: {
        ...mainFont,
        flex: 1,
        fontSize: 15,
        color: '#333333',
        paddingVertical: 9,
      },
      inputContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 70,
        borderWidth: 1,
        paddingHorizontal: 15,
        borderColor: 'rgba(0, 0, 0, 0.35)',
      },
      helperTextStyle: {
        color: '#FF3333',
        marginTop: spacing(1),
      },
      containerStyle: {},
    },
    mainFont,
  };

  return theme;
};
