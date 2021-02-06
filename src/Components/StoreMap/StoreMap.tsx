import React, {useRef, useState} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import MapView, {Marker, PROVIDER_DEFAULT, Region} from 'react-native-maps';
import {KadoStore} from '~/features/product/ProductTypes';

export interface StoreMapProps {
  style: StyleProp<ViewStyle>;
  storeList: Array<KadoStore>;
}

export const StoreMap = (props: StoreMapProps) => {
  const mapRef = useRef<MapView>(null);
  const [maxZoomLevel, setMaxZoomLevel] = useState(18);

  const fitToCoord: Array<Region> = props.storeList?.map((x) => {
    return {
      latitude: x.lat,
      longitude: x.lng,
      latitudeDelta: 0.0522,
      longitudeDelta: 0.0421,
    };
  });

  return (
    <>
      <MapView
        maxZoomLevel={maxZoomLevel}
        zoomControlEnabled={true}
        onRegionChangeComplete={() => {
          setMaxZoomLevel(20);
        }}
        onMapReady={() => {
          mapRef.current?.fitToCoordinates(fitToCoord, {
            animated: false,
          });
        }}
        provider={PROVIDER_DEFAULT} // remove if not using Google Maps
        style={props.style}
        ref={mapRef}>
        {props.storeList.map((storeItem) => {
          return (
            <Marker
              key={storeItem.storeId}
              title={storeItem.storeName}
              coordinate={{
                latitude: storeItem.lat,
                longitude: storeItem.lng,
              }}
            />
          );
        })}
      </MapView>
    </>
  );
};
