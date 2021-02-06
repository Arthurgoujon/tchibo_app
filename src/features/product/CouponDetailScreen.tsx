import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Share,
  View,
  Text,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  ProductScreenNavigationRouteProp,
  ProductScreenNavigationScreenProp,
} from '~/navigation';
import {ScrollView} from 'react-native-gesture-handler';
import {StoreMap} from '~/Components/StoreMap/StoreMap';
import {} from 'react-native-svg';
import {useDateUtil} from '~/hooks';
import {useCouponDetailsQuery} from './MyProducts/myProductQuery';
import {MonButton} from '~/Components/Button/MonButton';
import {ProductThumbItem} from './ProductThumbCard';
import {confirmAlert} from '~/features/utils/Utils';
import {useSelector} from 'react-redux';
import {isUserAuthenticatedSelector} from '../user/userSelectors';
import {
  useClaimProductMutation,
  useSaveSharedProductMutation,
} from './ProductsShop/productQuery';
import {Coupon, KadoProduct, ProductWithCoupon} from './ProductTypes';
import {ProductSendForm} from './components/ProductSendForm';
import QRCode from 'react-native-qrcode-svg';
import {makeThemedStyles} from '../theme/theme';

export const CouponDetailScreen = () => {
  const st = useStyles();
  const route = useRoute<ProductScreenNavigationRouteProp>();
  const navigation = useNavigation<ProductScreenNavigationScreenProp>();
  const isAuth = useSelector(isUserAuthenticatedSelector);
  const {formatDate} = useDateUtil();
  const [isShareVisible, setIsShareVisible] = useState(false);

  const {id, key} = route.params;
  const saveProductMutation = useSaveSharedProductMutation();

  const claimProductInStoreMutation = useClaimProductMutation();

  const productResp = useCouponDetailsQuery(id, key);

  const claimItem = (kado: KadoProduct, coupon: Coupon) => {
    navigation.navigate('ClaimProductScreen', {
      kado,
      coupon,
    });
  };

  const claimCuponManually = async (coupon: Coupon) => {
    try {
      await claimProductInStoreMutation.mutateAsync({
        couponId: coupon.id,
        couponKey: coupon.key,
      });
    } catch (err) {
      Alert.alert('Error', err?.message);
    }
  };

  const shareSuccess = (url: string) => {
    Share.share({
      url,
      message: url,
    });
  };

  const sendItem = async () => {
    setIsShareVisible(!isShareVisible);
  };

  const shareLink = async (coupon: Coupon) => {
    if (coupon.shortUrl) {
      Share.share({
        url: coupon.shortUrl,
        message: coupon.shortUrl,
      });
    } else {
      Alert.alert('Error', 'Unable to get shared link');
    }
  };

  const saveItem = async (coupon: Coupon) => {
    if (
      !isAuth &&
      (await confirmAlert(
        'Info',
        'Authenticate',
        'Cancel',
        'To save coupon you must be authenticated!',
      )) === false
    ) {
      return;
    }

    try {
      var couponId = await saveProductMutation.mutateAsync({
        id: coupon.id,
        key: coupon.key,
      });
      navigation.navigate('CouponDetailScreen', {
        id: couponId!,
        key: undefined,
      });
    } catch (err) {
      Alert.alert('Error', err?.message);
    }
  };

  const {kado, coupon} = productResp?.data || ({} as ProductWithCoupon);

  const renderOpenCoupon = () => {
    if (coupon?.canUseCouponManually) {
      return (
        <>
          <View style={st.actions}>
            <View style={st.useManuallyBtn}>
              <MonButton
                style={st.claimBtn}
                text="Use coupon manually"
                onActionPress={() => claimCuponManually(coupon)}
              />
            </View>
          </View>
          <StoreMap storeList={kado.storeList} style={st.map} />
        </>
      );
    }
    if (coupon?.notforthisStore) {
      return (
        <>
          <View style={[st.statusRow, st.statusRowUsed]}>
            <Text style={st.statusText}>Coupon is not for your store</Text>
          </View>
        </>
      );
    }

    if (coupon?.createReason === 'sent') {
      return (
        <>
          <View style={[st.actions, st.actionButtons]}>
            <MonButton
              style={st.saveBtn}
              text="Save"
              onActionPress={() => saveItem(coupon)}
            />
            <MonButton
              style={st.claimBtn}
              text="Claim"
              onActionPress={() => claimItem(kado, coupon)}
            />
          </View>
          <StoreMap storeList={kado.storeList} style={st.map} />
        </>
      );
    }

    return (
      <>
        <View style={[st.actions, st.actionButtons]}>
          <MonButton
            style={st.sharebtn}
            text="Share"
            onActionPress={() => sendItem()}
          />
          <MonButton
            style={st.claimBtn}
            text="Claim"
            onActionPress={() => claimItem(kado, coupon)}
          />
        </View>
        {isShareVisible && (
          <View style={st.sendFormContainer}>
            <ProductSendForm id={coupon.id} onSendSuccess={shareSuccess} />
          </View>
        )}
        <StoreMap storeList={kado.storeList} style={st.map} />
      </>
    );
  };

  const renderClosedCoupon = () => {
    if (coupon?.closeReason === 'sent') {
      return (
        <>
          <View style={st.descriptionBlock}>
            <View style={[st.statusRow, st.statusRowSent]}>
              <Text style={st.statusText}>Sent</Text>
            </View>
            <View style={st.description}>
              <Text style={st.descrItem}>
                Sent:{' '}
                <Text style={st.descrItemText}>
                  {formatDate(coupon.closeDate!)}
                </Text>
              </Text>
              <Text style={st.descrItem}>{coupon.shortUrl}</Text>
            </View>
            <View style={st.sendAgainBtnWrapper}>
              <MonButton
                style={st.sharebtn}
                text="Send again"
                onActionPress={() => shareLink(coupon)}
              />
            </View>
          </View>
          <StoreMap storeList={kado.storeList} style={st.map} />
        </>
      );
    }

    return (
      <>
        <View style={st.descriptionBlock}>
          <View style={[st.statusRow, st.statusRowUsed]}>
            <Text style={st.statusText}>Coupon already used</Text>
          </View>

          <View style={st.description}>
            {!!coupon.storeName && (
              <Text style={st.descrItem}>
                Store: <Text style={st.descrItemText}>{coupon.storeName}</Text>
              </Text>
            )}
            {!!coupon.closeDate && (
              <Text style={st.descrItem}>
                Used:{' '}
                <Text style={st.descrItemText}>
                  {formatDate(coupon.closeDate)}
                </Text>
              </Text>
            )}
          </View>
        </View>
        {!!coupon.url && (
          <View style={st.qrBox}>
            <QRCode size={200} value={coupon.url} />
          </View>
        )}
      </>
    );
  };

  const renderCoupon = () => {
    if (productResp.isLoading || productResp.isIdle) {
      return (
        <View style={st.emptyListItem}>
          <ActivityIndicator size="large" color={'black'} />
        </View>
      );
    }

    if (productResp.error) {
      return (
        <View style={st.emptyListItem}>
          <Text style={st.message}>{productResp.error?.message}</Text>
        </View>
      );
    }

    return (
      <>
        <View style={st.thumbCnt}>
          <ProductThumbItem product={kado} />
        </View>
        {coupon?.status === 'closed'
          ? renderClosedCoupon()
          : renderOpenCoupon()}
      </>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={st.scroll}
      refreshControl={
        <RefreshControl
          refreshing={!productResp.isLoading && productResp.isFetching}
          onRefresh={() => productResp.refetch()}
        />
      }>
      {renderCoupon()}
    </ScrollView>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  scroll: {
    flexGrow: 1,
  },
  thumbCnt: {
    paddingHorizontal: theme.distanceFromScreenEdges,
    height: 229,
    width: '100%',
    maxWidth: theme.kadoCardMaxWidth,
    alignSelf: 'center',
  },
  shareBtn: {
    ...theme.secondaryBtnStyle,
  },
  saveBtn: {
    ...theme.secondaryBtnStyle,
  },
  sharebtn: {
    ...theme.secondaryBtnStyle,
  },
  useManuallyBtn: {
    width: '80%',
    minWidth: 300,
    alignSelf: 'center',
  },
  sendAgainBtnWrapper: {
    width: '80%',
    minWidth: 200,
    alignSelf: 'center',
    marginVertical: 50,
  },
  map: {
    height: 261,
  },
  description: {
    marginVertical: 5,
    alignItems: 'center',
  },
  descrItem: {
    ...theme.mainFont,
    marginHorizontal: 45,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.05,
  },
  descrItemText: {
    ...theme.mainFont,
    marginHorizontal: 45,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.05,
  },
  actions: {
    flex: 1,
    marginTop: 50,
    marginBottom: 90,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: theme.distanceFromScreenEdges,
    maxWidth: theme.kadoCardMaxWidth,
  },
  actionButtons: {
    justifyContent: 'space-between',
  },
  button: {
    alignSelf: 'center',
    marginRight: 20,
  },
  sendFormContainer: {
    paddingHorizontal: theme.distanceFromScreenEdges,
    width: '100%',
    maxWidth: theme.kadoCardMaxWidth,
    alignSelf: 'center',
    marginBottom: 20,
    marginHorizontal: 30,
  },
  statusRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 93,
    marginBottom: 20,
  },
  statusRowSent: {
    backgroundColor: theme.primaryColor1,
  },
  statusRowUsed: {
    backgroundColor: theme.secondaryColor,
  },
  descriptionBlock: {
    // marginBottom: 10,
  },
  statusText: {
    ...theme.mainFont,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.05,
    color: '#FFFFFF',
  },
  claimBtn: {
    ...theme.primaryBtnStyle,
  },
  qrBox: {
    alignItems: 'center',
    marginVertical: 29,
  },
  message: {
    ...theme.mainFont,
  },
  emptyListItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
}));
