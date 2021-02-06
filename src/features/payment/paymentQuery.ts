import {MutationOptions, useMutation, useQueryClient} from 'react-query';
import {ReaqtQueryQueryNames} from '~/globals';
import {ConfirmPaymentParam, usePaymentService} from './paymentService';

export const usePaymentMutation = (
  config?: MutationOptions<void, Error, ConfirmPaymentParam>,
) => {
  const paymentService = usePaymentService();
  const queryCache = useQueryClient();
  const query = useMutation<void, Error, ConfirmPaymentParam>(
    async (request) => {
      await paymentService.confirmPayment(request);
      await queryCache.invalidateQueries(ReaqtQueryQueryNames.myproducts);
    },
    {
      ...(config ? config : {}),
      retry: false,
    },
  );

  return {
    ...query,
  };
};
