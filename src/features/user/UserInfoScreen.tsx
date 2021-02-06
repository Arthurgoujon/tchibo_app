import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {MonButton} from '~/Components/Button/MonButton';
import {UserInfoScreenNavigationScreenProp} from '~/navigation';
import {makeThemedStyles} from '../theme/theme';
import {useKadoAuth} from './auth/kadoAuth';
import {authenticatedUserSelector} from './userSelectors';

export const UserInfoScreen = () => {
  const st = useStyles();
  const navigation = useNavigation<UserInfoScreenNavigationScreenProp>();
  const authUser = useSelector(authenticatedUserSelector);
  const kadoAuth = useKadoAuth();

  const onLogoutPress = async () => {
    try {
      kadoAuth.logout();
      navigation.reset({
        routes: [
          {
            name: 'Home',
          },
        ],
        index: 0,
      });
    } catch (err) {
      Alert.alert('Error', err?.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={st.scroll}>
      <View style={st.screen}>
        <Text style={st.text}>{authUser.user?.email}</Text>
        <View style={st.logoutBtnWrapper}>
          <MonButton
            style={st.logoutBtn}
            onActionPress={onLogoutPress}
            text="Logout"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  scroll: {
    flexGrow: 1,
  },
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  logoutBtn: {
    ...theme.secondaryBtnStyle,
  },
  logoutBtnWrapper: {
    flex: 1,
    minWidth: 52,
    justifyContent: 'center',
  },
}));
