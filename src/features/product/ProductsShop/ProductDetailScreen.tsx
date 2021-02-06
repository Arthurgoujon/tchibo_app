import React, {useLayoutEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View} from 'react-native';
import {MonButton} from '../../../Components/Button/MonButton';
import {
  ProductDetailScreenNavigationRouteProp,
  ProductDetailScreenNavigationScreenProp,
} from '~/navigation';
import {ProductThumbItem} from '../ProductThumbCard';
import {ScrollView} from 'react-native-gesture-handler';
import {StoreMap} from '~/Components/StoreMap/StoreMap';
import {makeThemedStyles} from '~/features/theme/theme';
import {useSelector} from 'react-redux';
import {isUserAuthenticatedSelector} from '~/features/user/userSelectors';

export const ProductDetailScreen = () => {
  const isAuth = useSelector(isUserAuthenticatedSelector);
  const st = useStyles();
  const route = useRoute<ProductDetailScreenNavigationRouteProp>();
  const {product} = route.params;
  const checkoutNav = useNavigation<ProductDetailScreenNavigationScreenProp>();

  const getItem = () => {
    if (isAuth) {
      checkoutNav.navigate('ProductCheckoutScreen', {
        product,
      });
    } else {
      checkoutNav.navigate('LoginScreen');
    }
  };

  useLayoutEffect(() => {
    checkoutNav.setOptions({
      title: 'Product details',
      ...st.stackCardStyle,
    });
  });

  return (
    <ScrollView style={st.screen}>
      <View style={st.thumbCnt}>
        <ProductThumbItem product={product} />
      </View>
      <View style={st.btnWrapper}>
        <MonButton
          style={st.btnStyle}
          text="Get it now"
          onActionPress={getItem}
        />
      </View>
      <StoreMap storeList={product.storeList} style={st.map} />
    </ScrollView>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  stackCardStyle: theme.stackCardStyle,
  btnStyle: {
    ...theme.secondaryBtnStyle,
  },
  screen: {
    paddingTop: theme.distanceFromScreenEdges,
    backgroundColor: theme.backGroundColor,
  },
  thumbCnt: {
    paddingHorizontal: theme.distanceFromScreenEdges,
    height: 229,
    width: '100%',
    maxWidth: theme.kadoCardMaxWidth,
    alignSelf: 'center',
  },
  map: {
    height: 261,
  },
  btnWrapper: {
    height: 178,
    width: '100%',
    minWidth: 190,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
  },
}));
