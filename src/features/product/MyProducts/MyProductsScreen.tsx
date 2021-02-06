import React from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MyProductsScreenNavigationScreenProp} from 'src/navigation';
import {KadoProduct} from '../ProductTypes';
import {useMyproductsQuery} from './myProductQuery';
import {makeThemedStyles} from '~/features/theme/theme';
import {BasicButton} from '~/Components/Button/BasicButton';
import {ProductThumbItem} from '../ProductThumbCard';
import {MonButton} from '~/Components/Button/MonButton';

export const MyProductsScreen = () => {
  const st = useStyles();
  const navigation = useNavigation<MyProductsScreenNavigationScreenProp>();
  const myProducts = useMyproductsQuery();
  const onProductPress = (product: KadoProduct) => {
    navigation.navigate('CouponDetailScreen', {
      id: product.couponId!,
    });
  };

  const onHistoryPress = () => {
    navigation.navigate('MyProductsHistory');
  };

  const emptyListContainer = () => {
    if (myProducts.isError) {
      return (
        <View style={st.emptyListItem}>
          <Text style={st.message}>{myProducts.error!.toString()}</Text>
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
        <Text style={st.message}>You have not purchased any product yet !</Text>
      </View>
    );
  };

  const footerComponent = () => {
    return (
      <View style={st.footerContainer}>
        <View style={st.historyBtnWrapper}>
          <MonButton
            style={st.historyBtnStyle}
            text="Show archive"
            onActionPress={onHistoryPress}
          />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      contentContainerStyle={st.scroll}
      refreshing={!myProducts.isLoading && myProducts.isFetching}
      onRefresh={() => myProducts.refetch()}
      ListHeaderComponent={<View />}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => {
        return <View style={st.separator} />;
      }}
      ListFooterComponent={footerComponent}
      ListEmptyComponent={emptyListContainer}
      data={myProducts.data}
      keyExtractor={(x) => x.couponId!}
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
  productCard: {
    minHeight: 160,
    width: '45%',
    alignContent: 'stretch',
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyBtnWrapper: {
    width: '50%',
    minWidth: 200,
    marginBottom: theme.spacing(1),
  },
  historyBtnStyle: {
    ...theme.primaryBtnStyle,
  },
  productList: {
    paddingHorizontal: 7,
  },
  separator: {
    height: theme.spacing(1),
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
