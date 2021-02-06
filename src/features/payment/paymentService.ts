import stripe from 'react-native-stripe-payments';
import {Header} from 'react-native/Libraries/NewAppScreen';
import {AppConfig} from '../config/appConfig';
import {useKadoApi} from '../services/kadooApi';

export interface PaymentCardDetails {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

export interface ConfirmPaymentParam {
  quantity: number;
  kadoId: string;
  card: PaymentCardDetails;
}

const usePaymentService = () => {
  const {callKadoApi} = useKadoApi();

  const createStripeClientSecret = (quantity: number, kadoId: string) => {
    return callKadoApi('payment/paymentIntent', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        quantity,
        kadoId,
      }),
    }).then((x) => x.text());
  };

  const checkForConfirmation = (clientSecret: string) => {
    return callKadoApi('payment/checkForConfirmation', {
      method: 'POST',
      RequestTimeout: AppConfig.paymentConfirmApiTimeoutMs,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        clientSecret,
      }),
    }).then((x) => x.text());
  };

  const confirmPayment = async (req: ConfirmPaymentParam) => {
    const clientSecret = await createStripeClientSecret(
      req.quantity,
      req.kadoId,
    );

    stripe.setOptions({
      publishingKey: AppConfig.stripeKey,
    });
    const result = await stripe.confirmPayment(clientSecret, {
      cvc: req.card.cvc,
      expMonth: req.card.expMonth,
      expYear: req.card.expYear,
      number: req.card.number,
    });

    await checkForConfirmation(clientSecret);
    return result;
  };

  const validateCreditCard = (card: PaymentCardDetails) => {
    return stripe.isCardValid({
      cvc: card.cvc,
      expMonth: card.expMonth,
      expYear: card.expYear,
      number: card.number,
    });
  };

  return {
    confirmPayment,
    validateCreditCard,
  };
};

export {usePaymentService};
