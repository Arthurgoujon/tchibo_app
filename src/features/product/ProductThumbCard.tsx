import React from 'react';
import {View, Text, Image, StyleProp, ViewStyle} from 'react-native';
import {makeThemedStyles} from '../theme/theme';
import {KadoProduct} from './ProductTypes';

export interface ProductThumbItemProps {
  product: KadoProduct;
  style?: StyleProp<ViewStyle>;
}
export const ProductThumbItem = (props: ProductThumbItemProps) => {
  const st = useStyles();
  const {imageUrl, price, kadoName, logo} = props.product;

  return (
    <View style={[st.card, props.style]}>
      <Image
        style={st.productImage}
        resizeMode="cover"
        source={{uri: imageUrl}}
      />

      <View style={st.descriptionCard}>
        <View style={st.productLabels}>
          <Text style={st.label}>{kadoName}</Text>
          {price && <Text style={st.prceLabel}>£{price}</Text>}
        </View>
        <Image style={st.companyIcon} source={{uri: logo}} />
      </View>
    </View>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  productImage: {
    flex: 165,
    borderRadius: 9,
  },
  card: {
    flex: 1,
  },
  companyIcon: {
    height: '90%',
    // width: 97,
    alignSelf: 'flex-end',
    aspectRatio: 1,
  },
  productLabels: {
    flex: 2,
  },
  label: {
    ...theme.productCardTitleFont,
  },
  prceLabel: {
    ...theme.productCardPriceFont,
  },
  descriptionCard: {
    flex: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
}));
