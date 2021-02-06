import {KadoProduct} from '../ProductTypes';
import React, {useState} from 'react';
import {ActivityIndicator, FlatList, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ProductDetailScreenNavigationScreenProp} from 'src/navigation';
import {SearchInput} from '../../../Components/SearchInput/SearchInput';
import {useDebouncedValue} from '../../../hooks';
import {useProductsQuery} from './productQuery';
import {makeThemedStyles} from '~/features/theme/theme';
import {ProductThumbItem} from '../ProductThumbCard';
import SearchSvg from '@svg/search.svg';
import LocationSvg from '@svg/location.svg';
import {BasicButton} from '~/Components/Button/BasicButton';

export const ProductsScreen = () => {
  const st = useStyles();
  const navigation = useNavigation<ProductDetailScreenNavigationScreenProp>();
  const [postcode, setPostCode] = useState('');
  const [searchText, setSearchText] = useState('');
  const debouncedPostcode = useDebouncedValue(postcode, 1000);
  const debouncedSearchText = useDebouncedValue(searchText, 1000);
  const products = useProductsQuery(debouncedPostcode, debouncedSearchText);

  const onProductPress = (product: KadoProduct) => {
    navigation.navigate('ProductDetailScreen', {
      product,
    });
  };

  const onLocationPress = () => {
    navigation.navigate('LocationScreen', {
      onSelected: (value) => {
        setPostCode(value);
      },
      value: postcode,
    });
  };

  const emptyListContainer = () => {
    if (products.isError) {
      return (
        <View style={st.emptyListItem}>
          <Text>{products.error?.message}</Text>
        </View>
      );
    }

    if (products.isLoading) {
      return (
        <View style={st.emptyListItem}>
          <ActivityIndicator size={'large'} color={'black'} />
        </View>
      );
    }

    return (
      <View style={st.emptyListItem}>
        <Text>Empty result, try another filter</Text>
      </View>
    );
  };

  return (
    <FlatList
      contentContainerStyle={st.itemsContainer}
      refreshing={!products.isLoading && products.isFetching}
      onRefresh={() => products.refetch()}
      ListHeaderComponent={
        <View style={st.searchBar}>
          <SearchInput
            renderIcon={() => <LocationSvg />}
            value={postcode}
            dropDown={true}
            onPress={onLocationPress}
            placeholder="where"
          />
          <SearchInput
            renderIcon={() => <SearchSvg />}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="what"
          />
        </View>
      }
      ListEmptyComponent={emptyListContainer()}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => {
        return <View style={st.separator} />;
      }}
      data={products.data}
      keyExtractor={(x) => x.kadoId}
      renderItem={({item}) => {
        return (
          <BasicButton
            key={item.kadoId}
            onActionPress={() => onProductPress(item)}>
            {() => (
              <View style={st.thumbCnt}>
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
  searchBar: {
    paddingHorizontal: theme.distanceFromScreenEdges,
    paddingTop: theme.distanceFromScreenEdges,
    maxWidth: theme.kadoCardMaxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  thumbCnt: {
    paddingHorizontal: theme.distanceFromScreenEdges,
    height: 229,
    width: '100%',
    maxWidth: theme.kadoCardMaxWidth,
    alignSelf: 'center',
  },
  emptyListItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  itemsContainer: {
    flexGrow: 1,
  },
  separator: {
    height: theme.spacing(1),
  },
}));
