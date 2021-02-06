import {
  MutationOptions,
  QueryObserverOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import {ReaqtQueryQueryNames} from '~/globals';
import {ShareProductRequest, useProductService} from '../productService';
import {KadoProduct, ProductWithCoupon} from '../ProductTypes';

export const useMyproductsQuery = () => {
  const {getMyProducts} = useProductService();
  const query = useQuery<Array<KadoProduct>, Error>(
    ReaqtQueryQueryNames.myproducts,
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      const searchPromise = getMyProducts(signal);
      searchPromise.cancel = () => {
        controller.abort();
      };

      return searchPromise;
    },
    {
      staleTime: 0,
    },
  );

  return {
    ...query,
  };
};

export const useMyproductsHistoryQuery = () => {
  const {getMyProductsHistory} = useProductService();
  const query = useQuery<Array<KadoProduct>, Error>(
    ReaqtQueryQueryNames.myproductsHistory,
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      const searchPromise = getMyProductsHistory(signal);
      searchPromise.cancel = () => {
        controller.abort();
      };

      return searchPromise;
    },
    {
      staleTime: 0,
    },
  );

  return {
    ...query,
  };
};

export const useShareProductMutation = (
  config?: MutationOptions<string, Error, ShareProductRequest>,
) => {
  const {shareProduct} = useProductService();
  const queryCache = useQueryClient();
  const query = useMutation<string, Error, ShareProductRequest>(
    async (request) => {
      const result = await shareProduct(request);
      await queryCache.invalidateQueries(ReaqtQueryQueryNames.myproducts);
      await queryCache.invalidateQueries(ReaqtQueryQueryNames.myproductsHistory);
      await queryCache.invalidateQueries([
        ReaqtQueryQueryNames.couponDetailsQuery,
        request.couponId,
      ]);

      return result;
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

export const useCouponDetailsQuery = (
  id: string,
  key?: string,
  config?: QueryObserverOptions<ProductWithCoupon, Error>,
) => {
  const {couponDetails} = useProductService();
  const query = useQuery<ProductWithCoupon, Error>(
    [ReaqtQueryQueryNames.couponDetailsQuery, id, key],
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      const searchPromise = couponDetails(id, key, signal);
      searchPromise.cancel = () => {
        controller.abort();
      };

      return searchPromise;
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
