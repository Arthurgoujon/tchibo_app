import {useKadoApi} from '../services/kadooApi';
import {KadoProduct, ProductWithCoupon} from './ProductTypes';

export const useProductService = () => {
  const {fetchJson, callKadoApi} = useKadoApi();

  const getMyProducts = async (
    signal: AbortSignal,
  ): Promise<Array<KadoProduct>> => {
    try {
      return await fetchJson('kado/myproducts', {
        method: 'POST',
        signal,
      });
    } catch (err) {
      throw new Error(`Can't get your product list, ${err?.message}`);
    }
  };

  const getMyProductsHistory = async (
    signal: AbortSignal,
  ): Promise<Array<KadoProduct>> => {
    try {
      return await fetchJson('kado/myproductsHistory', {
        method: 'POST',
        signal,
      });
    } catch (err) {
      throw new Error(`Can't get your product list, ${err?.message}`);
    }
  };

  const searchAvailableProducts = async (
    postcode: string,
    search: string,
    signal: AbortSignal,
  ) => {
    try {
      const params = new URLSearchParams();
      params.append('postcode', postcode);
      params.append('search', search);

      return await fetchJson('kado/filter?' + params.toString(), {
        method: 'POST',
        signal,
      });
    } catch (err) {
      throw new Error(`Can't get product list, ${err?.message}`);
    }
  };

  const getStorekey = async (
    couponId: string,
    storeId: string,
    token: string,
    couponKey?: string,
    signal?: AbortSignal,
  ): Promise<GetStoreKeyResult> => {
    try {
      var body = {
        couponId,
        storeId,
        token,
        key: couponKey || '',
      };
      return await fetchJson('coupon/getStoreKey', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(body),
        signal,
      });
    } catch (err) {
      throw new Error(`Can't get store key ${err?.message}`);
    }
  };

  const claimProduct = async (
    request: ClaimProductRequest,
    signal?: AbortSignal,
  ): Promise<void> => {
    try {
      var body = {
        couponId: request.couponId,
        key: request.couponKey,
      };
      await callKadoApi('coupon/claimProduct', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(body),
        signal,
      });
    } catch (err) {
      throw new Error(`Coupon ${err?.message}`);
    }
  };

  const couponDetails = async (
    id: string,
    key?: string,
    signal?: AbortSignal,
  ): Promise<ProductWithCoupon> => {
    try {
      return await fetchJson('coupon/viewProduct', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        signal,
        body: JSON.stringify({
          id,
          key,
        }),
      });
    } catch (err) {
      throw new Error(`Can't view coupon, ${err?.message}`);
    }
  };

  const shareProduct = async (
    request: ShareProductRequest,
    signal?: AbortSignal,
  ): Promise<string> => {
    try {
      var result = await callKadoApi('coupon/shortUrl', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        signal,
        body: JSON.stringify({
          couponId: request.couponId,
          name: request.name,
        }),
      });
      return result.text();
    } catch (err) {
      throw new Error(`Can't share coupon, ${err?.message}`);
    }
  };

  const saveSharedProduct = async (
    request: SaveSharedProductRequest,
    signal?: AbortSignal,
  ): Promise<string> => {
    try {
      const couponId = await callKadoApi('coupon/saveProduct', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        signal,
        body: JSON.stringify({
          couponId: request.id,
          key: request.key,
        }),
      }).then((resp) => resp.text());
      return couponId;
    } catch (err) {
      throw new Error(`Can't save coupon, ${err?.message}`);
    }
  };

  return {
    getMyProductsHistory,
    getStorekey,
    claimProduct,
    getMyProducts,
    searchAvailableProducts,
    couponDetails,
    shareProduct,
    saveSharedProduct,
  };
};

export interface ClaimProductRequest {
  couponId: string;
  couponKey: string;
}

export interface SaveSharedProductRequest {
  id: string;
  key: string;
}
export interface ShareProductRequest {
  couponId: string;
  name: string;
}

export interface GetStoreKeyResult {
  coupon: KadoProduct;
  storeKey: string;
}
