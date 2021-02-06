import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {
  ProductCheckoutScreenNavigationRouteProp,
  ProductCheckoutScreenNavigationScreenProp,
} from 'src/navigation';
import {ScrollView} from 'react-native-gesture-handler';
import {QuantityChooser} from '../../../Components/QuantityChooser/QuantityChooser';
import CardSvg from '@svg/card.svg';
import {makeThemedStyles} from '~/features/theme/theme';
import {ProductThumbItem} from '../ProductThumbCard';
import {MonButton} from '~/Components/Button/MonButton';

export const ProductCheckoutScreen = () => {
  const st = useStyles();
  const route = useRoute<ProductCheckoutScreenNavigationRouteProp>();
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation<ProductCheckoutScreenNavigationScreenProp>();
  const {product} = route.params;

  const onPayPress = () => {
    navigation.navigate('PaymentScreen', {
      quantity,
      product,
    });
  };

  return (
    <ScrollView>
      <View style={st.thumbCnt}>
        <ProductThumbItem product={product} />
      </View>
      <View style={st.actions}>
        <View style={st.productDetails}>
          <Text style={st.chooserDescr}>Quantity</Text>
          <QuantityChooser
            value={quantity.toString()}
            onIncrement={() => setQuantity(quantity + 1)}
            onDecrement={() => {
              if (quantity === 1) {
                return;
              }
              setQuantity(quantity - 1);
            }}
          />
          <View style={st.descrCont}>
            <View style={st.description}>
              <Text style={st.label}>Partner:</Text>
              <Text style={st.descr}>{product.partnerName}</Text>
            </View>
            <View style={st.description}>
              <Text style={st.label}>Product:</Text>
              <Text style={st.descr}>{product.kadoName}</Text>
            </View>
            <View style={st.description}>
              <Text style={st.label}>Unit Price:</Text>
              <Text style={st.descr}>£{product.price}</Text>
            </View>
            <View style={st.description}>
              <Text style={st.label}>Quantity:</Text>
              <Text style={st.descr}>{quantity}</Text>
            </View>
            {quantity > 1 && (
              <View style={st.description}>
                <Text style={[st.label, st.totalPriceLabel]}>Total Price:</Text>
                <Text style={[st.descr, st.totalPriceLabel]}>
                  £{quantity * product.price!}
                </Text>
              </View>
            )}
          </View>
        </View>
        <MonButton
          style={st.payButton}
          icon={() => <CardSvg color={'black'} />}
          text="Card"
          onActionPress={onPayPress}
        />
      </View>
    </ScrollView>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  label: {
    ...theme.mainFont,
    fontSize: 15,
    marginRight: 5,
    fontWeight: 'bold',
  },
  descr: {
    ...theme.mainFont,
  },
  totalPriceLabel: {
    color: theme.secondaryColor,
  },
  descrCont: {
    marginTop: 59,
  },
  actions: {
    paddingHorizontal: 10,
  },
  productDetails: {
    marginVertical: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    flexDirection: 'row',
  },
  thumbCnt: {
    paddingHorizontal: theme.distanceFromScreenEdges,
    height: 229,
    width: '100%',
    maxWidth: theme.kadoCardMaxWidth,
    alignSelf: 'center',
  },
  itemLabel: {},
  itemDescr: {},
  payButton: {
    ...theme.outlineBtnStyle,
  },
  chooserDescr: {
    ...theme.mainFont,
    marginHorizontal: 45,
    marginBottom: 18,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: 0.05,
    textDecorationLine: 'underline',
    color: '#333333',
  },
}));
