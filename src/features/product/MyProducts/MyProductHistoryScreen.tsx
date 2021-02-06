import {ProductCard} from '../ProductCard';
import React from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MyProductsHistoryScreenNavigationScreenProp} from 'src/navigation';
import {KadoProduct} from '../ProductTypes';
import {useMyproductsHistoryQuery} from './myProductQuery';
import {makeThemedStyles} from '~/features/theme/theme';
import {BasicButton} from '~/Components/Button/BasicButton';
import {ProductThumbItem} from '../ProductThumbCard';

export const MyProductsHistoryScreen = () => {
  const st = useStyles();
  const navigation = useNavigation<
    MyProductsHistoryScreenNavigationScreenProp
  >();
  const myProducts = useMyproductsHistoryQuery();
  const onProductPress = (product: KadoProduct) => {
    navigation.navigate('CouponDetailScreen', {
      id: product.couponId!,
    });
  };

  const emptyListContainer = () => {
    if (myProducts.isError) {
      return (
        <View style={st.emptyListItem}>
          <Text style={st.message}>{myProducts.error?.message}</Text>
        </View>
      );
    }
    if (myProducts.isLoading) {
      return (
        <View style={st.emptyListItem}>
          <ActivityIndicator size={'large'} color={'black'} />
        </View>
      );
    }

    return (
      <View style={st.emptyListItem}>
        <Text style={st.message}>No items</Text>
      </View>
    );
  };

  return (
    <FlatList
      contentContainerStyle={st.screen}
      refreshing={!myProducts.isLoading && myProducts.isFetching}
      onRefresh={() => myProducts.refetch()}
      ListHeaderComponent={<View />}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => {
        return <View style={st.separator} />;
      }}
      ListEmptyComponent={emptyListContainer}
      data={myProducts.data}
      keyExtractor={(x) => x.kadoId + x.couponId}
      renderItem={({item}) => {
        return (
          <BasicButton onActionPress={() => onProductPress(item)}>
            {() => (
              <View key={item.kadoId} style={st.thumbCnt}>
                <ProductThumbItem product={item} />
              </View>
            )}
          </BasicButton>
        );
      }}
    />
  );
};

const useStyles = makeThemedStyles((theme) => ({
  screen: {
    flexGrow: 1,
  },
  thumbCnt: {
    paddingHorizontal: theme.distanceFromScreenEdges,
    height: 229,
    width: '100%',
    maxWidth: theme.kadoCardMaxWidth,
    alignSelf: 'center',
  },
  productCard: {
    minHeight: 160,
    width: '45%',
    alignContent: 'stretch',
  },
  separator: {
    height: theme.spacing(1),
  },
  emptyListItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    ...theme.mainFont,
  },
}));
