import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { makeThemedStyles } from '~/features/theme/theme';
import { MonButton, MonButtonStyle } from '../Button/MonButton';
import { useBluetoothDeviceListState } from './useBluetoothDeviceListState';

export interface BluetoothDeviceListProps {
    bleManager: BleManager;
    onDevicePress?: (dev: Device) => Promise<void>
}
export const BluetoothDeviceList: React.FC<BluetoothDeviceListProps> = (props) => {
    const { state } = useBluetoothDeviceListState({
        bleManager: props.bleManager
    });
    const st = useStyles();
    const devices = Array.from(state.deviceListMap.values());

    const onDevicePress = async (device: Device) => {
        if (props.onDevicePress) {
            props.onDevicePress(device);
        }
    }

    return (
        <View
            style={[st.btDevices, devices?.length > 0 ? null : st.emptyBtDevices]}>
            <View style={st.descriptionContainer}>
                {/* <Text style={st.description}>Scanning for bluetooth devices</Text> */}
                <View style={st.spinnerView}>
                    <ActivityIndicator size={'small'} color={'black'} />
                </View>
            </View>

            {devices.map((item) => {
                return (
                    <MonButton
                        key={item.id}
                        style={st.deviceBtn}
                        text={item.name || 'This device has no name'}
                        onActionPress={() => onDevicePress(item)}
                    />
                );
            })}
        </View>
    );
}


const useStyles = makeThemedStyles((theme) => {
    const deviceBtn: MonButtonStyle = {
        buttonStyle: {
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#333333',
            paddingVertical: 15,
            paddingHorizontal: 39,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(2),
        },
        actIndStyle: {
            style: {
                flex: 1,
            },
            indicator: {
                size: 'small',
                color: '#333333',
            },
        },
        textStyle: {
            color: '#333333',
            ...theme.mainFont,
            fontSize: 19,
            lineHeight: 22,
            flex: 1,
            textAlign: 'center',
        },
    };
    return {
        screen: {
            flex: 1,
        },
        btDevices: {
            flex: 1,
        },
        emptyBtDevices: {
            justifyContent: 'center',
        },
        deviceList: {
            backgroundColor: '#b2b2b2',
        },
        deviceBtn,
        descriptionContainer: {
            flexDirection: 'column',
        },
        btDevice: {
            padding: 10,
            backgroundColor: '#FFFFFF',
        },
        btDeviceWithName: {
            color: '#525050',
        },
        btDeviceWithoutName: {
            color: '#9d9d9d',
        },
        btDeviceId: {
            color: '#525050',
        },
        description: {
            paddingVertical: 10,
            fontSize: 15,
        },
        spinnerView: {
            paddingLeft: 10,
            paddingBottom: 10,
            alignItems: 'flex-start',
            alignSelf: 'center',
        },
        btDeviceSeparator: {
            height: 2,
            backgroundColor: 'transparent',
        },
    };
});
