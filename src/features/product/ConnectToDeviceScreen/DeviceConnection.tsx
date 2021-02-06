import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { ActionableText } from '../../../Components/ActionableText/ActionableText';
import { useConnectToDeviceScreenState } from './useDeviceConnectionState';
import { makeThemedStyles } from '~/features/theme/theme';
import { BleManager } from 'react-native-ble-plx';

export interface DeviceConnectionProps {
    bleManager: BleManager
}
const DeviceConnection: React.FC<DeviceConnectionProps> = (props) => {
    const st = useStyles();
    const { state, startConnection } = useConnectToDeviceScreenState({
        bleManager: props.bleManager
    });

    if (state.error) {
        return (
            <View style={st.requiredAction}>
                <ActionableText
                    text={state.error}
                    actionText="Try again"
                    onActionPress={startConnection}
                />
            </View>
        );
    }

    return (
        <View style={st.description}>
            <Text style={st.descriptionText}>{state.status}</Text>
            {state.isLoading && (
                <ActivityIndicator size={'small'} color={'white'} />
            )}
        </View>
    );
};

export { DeviceConnection };

const useStyles = makeThemedStyles((theme) => ({
    screen: {
        flex: 1,
        backgroundColor: theme.mainColor,
    },
    description: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    descriptionText: {
        ...theme.headerTitle,
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 34,
    },
    requiredAction: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        fontSize: 15,
    },
    status: {
        fontSize: 13,
        marginBottom: 10,
    },
}));
