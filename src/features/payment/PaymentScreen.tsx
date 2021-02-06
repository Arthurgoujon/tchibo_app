import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {View, Alert} from 'react-native';
import {
  PaymentScreenNavigationRouteProp,
  PaymentScreenNavigationScreenProp,
} from 'src/navigation';
import {ScrollView} from 'react-native-gesture-handler';
import {MonInput} from '~/Components/MonInput/MonInput';
import {MonButton} from '~/Components/Button/MonButton';
import {useField, useForm, valReq} from '../valitation/formValidation';
import {PaymentCardDetails, usePaymentService} from './paymentService';
import CardSvg from '@svg/card.svg';
import {makeThemedStyles} from '../theme/theme';
import {usePaymentMutation} from './paymentQuery';
import {useCreditCardMask} from '../valitation/formMask';

export const PaymentScreen = () => {
  const st = useStyles();
  const route = useRoute<PaymentScreenNavigationRouteProp>();
  const navigation = useNavigation<PaymentScreenNavigationScreenProp>();
  const paymentService = usePaymentService();
  const cardNumberInput = useCreditCardMask(
    useField(__DEV__ ? '4242424242424242' : ''),
    16,
  );
  const nameInput = useField(__DEV__ ? 'David' : '');
  const expMonthInput = useField(__DEV__ ? '12' : '');
  const expYearInput = useField(__DEV__ ? '2022' : '');
  const cvcInput = useField(__DEV__ ? '123' : '');

  const paymentMutation = usePaymentMutation();

  const validateForm = useCallback(() => {
    const requiredText = 'Required';

    const isCardValid = [
      valReq(cardNumberInput, requiredText),
      valReq(nameInput, requiredText),
      valReq(expMonthInput, requiredText),
      valReq(expYearInput, requiredText),
      valReq(cvcInput, requiredText),
    ].every((x) => x);

    return Promise.resolve(isCardValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cardNumberInput.value,
    nameInput.value,
    expMonthInput.value,
    expYearInput.value,
    cvcInput.value,
  ]);

  const form = useForm(validateForm);

  const onBuyPress = async () => {
    if (!(await form.validate())) {
      return;
    }

    try {
      const cvc = cvcInput.value?.trim();
      const expMonth = parseInt(expMonthInput.value?.trim(), 10);
      const expYear = parseInt(expYearInput.value?.trim(), 10);
      const number = cardNumberInput.value?.trim();

      const card: PaymentCardDetails = {
        cvc,
        expMonth,
        expYear,
        number,
      };

      if (!paymentService.validateCreditCard(card)) {
        Alert.alert('Invalid card', 'Card details you entered are invalid');
        return;
      }

      await paymentMutation.mutateAsync({
        quantity: route.params.quantity,
        kadoId: route.params.product.kadoId,
        card,
      });

      navigation.reset({
        routes: [
          {
            name: 'Home',
          },
          {
            name: 'PurchaseSuccessScreen',
          },
        ],
        index: 1,
      });
    } catch (err) {
      Alert.alert('Error', err?.message);
    }
  };

  return (
    <ScrollView>
      <View style={st.form}>
        <MonInput
          error={nameInput.hasError}
          helperText={nameInput.errorText}
          value={nameInput.value}
          onChangeText={nameInput.onChange}
          label="Name"
        />
        <MonInput
          error={cardNumberInput.hasError}
          helperText={cardNumberInput.errorText}
          value={cardNumberInput.maskedValue}
          onChangeText={cardNumberInput.onChange}
          maxLength={cardNumberInput.maxLength}
          keyboardType="numeric"
          icon={() => <CardSvg color={st.cardSvgIcon.color} />}
          label="Card number"
        />

        <View style={st.cardDetails}>
          <View style={st.cardInputWrapper}>
            <MonInput
              error={expMonthInput.hasError}
              helperText={expMonthInput.errorText}
              value={expMonthInput.value}
              onChangeText={expMonthInput.onChange}
              label="Month"
              placeholder="MM"
            />
          </View>
          <View style={st.cardInputWrapper}>
            <MonInput
              error={expYearInput.hasError}
              helperText={expYearInput.errorText}
              value={expYearInput.value}
              onChangeText={expYearInput.onChange}
              placeholder="YYYY"
              label="Year"
            />
          </View>
          <View style={st.cardInputWrapper}>
            <MonInput
              error={cvcInput.hasError}
              helperText={cvcInput.errorText}
              value={cvcInput.value}
              onChangeText={cvcInput.onChange}
              placeholder="cvc"
              label="cvc"
            />
          </View>
        </View>
      </View>
      <View style={st.playBtnWrapper}>
        <MonButton
          style={st.payBtn}
          text="Buy now"
          onActionPress={onBuyPress}
        />
      </View>
    </ScrollView>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  payBtn: {
    ...theme.secondaryBtnStyle,
  },
  cardSvgIcon: {
    color: theme.secondaryColor,
  },
  playBtnWrapper: {
    minWidth: 200,
    marginHorizontal: theme.spacing(2),
  },
  form: {
    paddingHorizontal: theme.spacing(4),
    marginBottom: 10,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInputWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
}));
