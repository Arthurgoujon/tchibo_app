import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, View } from 'react-native';
import {
    Permission,
    PERMISSIONS,
    requestMultiple,
    openSettings,
} from 'react-native-permissions';
import { makeThemedStyles } from '~/features/theme/theme';
import { useAppStateChange } from '~/hooks';
import { MonButton } from './Button/MonButton';

export const PermissionLoader: React.FC<PermissionLoaderProps> = (props) => {
    const st = useStyles();
    //   const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();
    const [permState, setPermState] = useState<permStateType>();

    const retry = async () => {
        try {
            if (props.onRetryPress) {
                await props.onRetryPress();
            }
        } catch (err) { }
    };

    const openSettingsPress = async () => {
        try {
            await openSettings();
        } catch (err) {
            Alert.alert(
                'Error',
                'Please go to app settings and manually allow app to use permissions listed above'
            );
        }
    };

    const checkForPermissions = async () => {
        try {
            // convert before passing to rn permissons
            const perms = props.permissions.map((x) => {
                const res = permissionMap.get(x);
                if (!res) {
                    throw new Error('Unmapped permission type');
                }
                return res;
            });

            const perm = await requestMultiple(perms);
            setPermState(perm);
        } catch (err) {
            setError(err);
        }
    };

    useAppStateChange('change', (appState) => {
        if (appState === 'active') {
            checkForPermissions();
        }
    });

    useEffect(() => {
        checkForPermissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) {
        return (
            <View style={st.screen}>
                <Text style={st.errorText}>{error?.message}</Text>
            </View>
        );
    }

    if (!permState) {
        return (
            <View style={st.screen}>
                <ActivityIndicator size="large" color="black" />
            </View>
        );
    }

    let isBlocked = false;
    let isUnavailable = false;
    let isDenied = false;

    const errors = Object.entries(permState)
        .map(([key, val]) => {
            const translatedKey = permissionMapMirror.get(key);

            if (!translatedKey) {
                throw new Error('developer unmapped permission');
            }

            if (translatedKey === PermissionType.camera) {
                return {
                    text: 'Camera permission ',
                    status: val,
                };
            }

            if (translatedKey === PermissionType.bluetooth) {
                return {
                    text: 'Bluetooth permission ',
                    status: val,
                };
            }

            throw new Error('developer unmapped permission');
        })
        .map((x) => {
            switch (x.status) {
                case 'blocked':
                    if (!isBlocked) {
                        isBlocked = true;
                    }
                    return x.text + 'blocked';
                case 'denied':
                    if (!isDenied) {
                        isDenied = true;
                    }
                    return x.text + 'restricted';
                case 'unavailable':
                    if (!isUnavailable) {
                        isUnavailable = false;
                    }
                    return (
                        x.text + "error your device does not supports one"
                    );
                default:
                    return null;
            }
        })
        .filter((x) => !!x);

    if (isUnavailable) {
        return (
            <View style={st.screen}>
                {errors.map((x) => (
                    <Text key={x} style={st.errorText}>
                        {x}
                    </Text>
                ))}
            </View>
        );
    }

    if (isBlocked) {
        return (
            <View style={st.screen}>
                {errors.map((x) => (
                    <Text key={x} style={st.errorText}>
                        {x}
                    </Text>
                ))}
                <View style={st.btnWrapper}>
                    <MonButton
                        style={st.btn}
                        text="Settings"
                        onActionPress={openSettingsPress}
                    />
                </View>
            </View>
        );
    }

    if (isDenied) {
        return (
            <View style={st.screen}>
                {errors.map((x) => (
                    <Text key={x} style={st.errorText}>
                        {x}
                    </Text>
                ))}
                <View style={st.btnWrapper}>
                    <MonButton
                        style={st.btn}
                        text="Allow permission"
                        onActionPress={checkForPermissions}
                    />
                </View>
            </View>
        );
    }

    return <>{props.children}</>;
};

const useStyles = makeThemedStyles((theme) => ({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    error: {
        flexDirection: 'row',
    },
    btnWrapper: {
        marginTop: theme.spacing(2),
    },
    errorText: {},
    btn: {
        ...theme.primaryBtnStyle,
    },
}));

export enum PermissionType {
    'camera' = 'camera',
    'bluetooth' = 'bluetooth',
}

const permissionMap = new Map<string, Permission>();
permissionMap.set(
    PermissionType.camera,
    Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
        default: PERMISSIONS.ANDROID.CAMERA,
    }),
);

permissionMap.set(
    PermissionType.bluetooth,
    Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
        default: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    }),
);


const permissionMapMirror = Array.from(permissionMap.entries()).reduce(
    (acc, ent) => {
        acc.set(ent[1], ent[0]);
        return acc;
    },
    new Map<string, string>(),
);

type permStateType = Record<
    Permission,
    'unavailable' | 'blocked' | 'denied' | 'granted' | 'limited'
>;

export interface PermissionLoaderProps {
    permissions: Array<PermissionType>;
    onRetryPress?: () => Promise<void>;
}
