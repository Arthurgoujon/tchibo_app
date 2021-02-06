import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useLayoutEffect, useState} from 'react';
import {FlatList, Image, Text, TextInput, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BasicButton} from '~/Components/Button/BasicButton';
import {ScreenDataLoader} from '~/Components/ScreenDataLoader';
import {PlacePredictionResult} from '~/features/services/placesApi';
import {makeThemedStyles} from '~/features/theme/theme';
import {useDebouncedValue} from '~/hooks';
import {LocationScreenProp, LocationScreenRouteProp} from '~/navigation';
import {usePlacesQuery} from './productQuery';
import poweredByGoogleImg from '~/assets/img/powered_by_google_on_white.png';

export interface LocationScreenParams {
  value: string;
  onSelected: (value: string) => void;
}

export const LocationScreen = () => {
  const st = useStyles();
  const navigation = useNavigation<LocationScreenProp>();
  const route = useRoute<LocationScreenRouteProp>();
  const [text, setText] = useState(route.params.value || '');
  const debouncedSearchText = useDebouncedValue(text, 200);
  const locationQuery = usePlacesQuery(debouncedSearchText);

  const onClear = () => {
    setText('');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <TextInput
            autoFocus={true}
            value={text}
            onChangeText={setText}
            placeholder="Where"
          />
        );
      },
      headerRight: () => {
        return (
          <Ionicons
            onPress={onClear}
            name={'close-outline'}
            size={30}
            color={'#000000'}
          />
        );
      },
      ...st.cardStyle,
      headerTitleAlign: 'left',
      headerRightContainerStyle: st.headerRight,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const retry = async () => {
    await locationQuery.refetch();
  };

  const onItemPress = (item: PlacePredictionResult) => {
    if (route.params.onSelected) {
      route.params.onSelected(item.description);
    }
    navigation.goBack();
  };

  if (locationQuery.isLoading || locationQuery.isError) {
    return (
      <ScreenDataLoader
        isLoading={locationQuery.isLoading}
        hasError={locationQuery.isError}
        errorMessage={locationQuery.error?.message}
        onRetryPress={retry}
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={st.itemsContainer}
      refreshing={!locationQuery.isLoading && locationQuery.isFetching}
      onRefresh={retry}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => {
        return <View style={st.separator} />;
      }}
      data={locationQuery.data}
      keyExtractor={(x) => x.id}
      ListFooterComponentStyle={st.listFooter}
      ListFooterComponent={() => {
        return <Image source={poweredByGoogleImg} />;
      }}
      renderItem={({item}) => {
        return (
          <BasicButton key={item.id} onActionPress={() => onItemPress(item)}>
            {() => (
              <View style={st.itemCont}>
                <Text>{item.description}</Text>
              </View>
            )}
          </BasicButton>
        );
      }}
    />
  );
};

const useStyles = makeThemedStyles((theme) => ({
  itemsContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.distanceFromScreenEdges,
  },
  cardStyle: theme.stackCardStyle,
  headerRight: {
    paddingHorizontal: theme.spacing(1),
  },
  itemCont: {
    paddingVertical: theme.spacing(1),
  },
  separator: {
    height: theme.spacing(1),
  },
  listFooter: {
    alignItems: 'center',
    marginTop: 30,
  },
}));
