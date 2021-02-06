import {
  MutationOptions,
  QueryObserverOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import {
  PlacePredictionResult,
  usePlacesApi,
} from '~/features/services/placesApi';
import {ReaqtQueryQueryNames} from '~/globals';
import {
  ClaimProductRequest,
  SaveSharedProductRequest,
  useProductService,
} from '../productService';
import {KadoProduct} from '../ProductTypes';

export const useProductsQuery = (postcode: string, search: string) => {
  const {searchAvailableProducts} = useProductService();
  const query = useQuery<Array<KadoProduct>, Error>(
    [ReaqtQueryQueryNames.products, postcode, search],
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      const searchPromise = searchAvailableProducts(postcode, search, signal);
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

export const useSaveSharedProductMutation = (
  config?: MutationOptions<string, Error, SaveSharedProductRequest>,
) => {
  const queryCache = useQueryClient();

  const {saveSharedProduct} = useProductService();
  const query = useMutation<string, Error, SaveSharedProductRequest>(
    async (request) => {
      const result = await saveSharedProduct(request);

      //Refetch
      await queryCache.invalidateQueries(ReaqtQueryQueryNames.myproducts);
      await queryCache.invalidateQueries([
        ReaqtQueryQueryNames.couponDetailsQuery,
        request.id,
        request.key,
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

export const useClaimProductMutation = (
  config?: MutationOptions<void, Error, ClaimProductRequest>,
) => {
  const queryCache = useQueryClient();

  const {claimProduct} = useProductService();
  const query = useMutation<void, Error, ClaimProductRequest>(
    async (request) => {
      const result = await claimProduct(request);
      //Refetch
      await queryCache.invalidateQueries(ReaqtQueryQueryNames.myproducts);
      await queryCache.invalidateQueries([
        ReaqtQueryQueryNames.couponDetailsQuery,
        request.couponId,
        request.couponKey,
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

export const usePlacesQuery = (
  input: string,
  config?: QueryObserverOptions<Array<PlacePredictionResult>, Error>,
) => {
  const {autocomplete} = usePlacesApi();
  const query = useQuery<Array<PlacePredictionResult>, Error>(
    [ReaqtQueryQueryNames.usePlaces, input],
    async () => {
      const controller = new AbortController();
      const signal = controller.signal;
      const prom = autocomplete(input, signal);
      prom.cancel = () => {
        controller.abort();
      };

      const result = await prom;
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
