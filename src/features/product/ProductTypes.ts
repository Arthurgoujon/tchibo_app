export interface KadoProduct {
  kadoId: string;
  kadoName: string;
  imageUrl: string;
  logo: string;
  partnerId: string;
  partnerName: string;
  price: number | null;
  couponId?: string;
  storeList: Array<KadoStore>;
  userName: string;
  date: string;
}

export interface KadoSummary {
  name: string;
  user: string;
  date: string;
}

export interface KadoStore {
  storeId: string;
  secret: string;
  partnerName: string;
  storeName: string;
  partnerId: string;
  lng: number;
  lat: number;
}

export interface Coupon {
  id: string;
  key: string;
  closeDate?: Date;
  storeName?: string;
  url: string;
  closeReason: 'sent' | 'claimed' | 'received';
  imageUrl: string;
  status: 'open' | 'closed';
  createReason: 'sent' | 'payed' | 'received';
  shortUrl?: string;
  canUseCouponManually?: boolean;
  notforthisStore?: boolean;
}

export interface ProductWithCoupon {
  coupon: Coupon;
  kado: KadoProduct;
  isMine: boolean;
}
