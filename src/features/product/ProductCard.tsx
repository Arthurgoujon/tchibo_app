import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {KadoProduct} from './ProductTypes';

export interface ProductCardProps {
  item: KadoProduct;
}
export const ProductCard = (props: ProductCardProps) => {
  const {imageUrl, kadoName: name, price} = props.item;
  return (
    <View style={st.card}>
      <Image style={st.thumb} source={{uri: imageUrl}} />
      <View style={st.description}>
        <Text style={st.label}>{name}</Text>
        {price ? <Text style={st.label}>{price}</Text> : null}
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  card: {
    // minHeight: 160,
  },
  thumb: {
    height: 124,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  description: {
    minHeight: 35,
    // justifyContent: 'center',
    // alignItems: 'flex-start',
    backgroundColor: '#EE727C',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingVertical: 7,
    paddingHorizontal: 7,
  },
  label: {
    fontFamily: 'RobotoMono-Bold',
    textTransform: 'capitalize',
    fontSize: 11,
    lineHeight: 15,
    color: '#FFFFFF',
  },
});
