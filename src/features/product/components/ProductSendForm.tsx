import React, {useCallback, useEffect} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {BasicButton} from '~/Components/Button/BasicButton';
import {MonInput} from '~/Components/MonInput/MonInput';
import {useField, useForm, valReq} from '~/features/valitation/formValidation';
import {useShareProductMutation} from '../MyProducts/myProductQuery';
import SendIcon from '@svg/sendicon.svg';
import {makeThemedStyles} from '~/features/theme/theme';

export interface ProductSendFormParams {
  id: string;
  key?: string;
  onSendSuccess: (url: string) => void;
}
export const ProductSendForm: React.FC<ProductSendFormParams> = (props) => {
  const st = useStyles();
  const nameField = useField('');
  const validate = useCallback(() => {
    const requiredText = 'Required';
    const isValid = valReq(nameField, requiredText);
    return Promise.resolve(isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameField.value]);
  const form = useForm(validate);

  const shareMutation = useShareProductMutation();

  const onGetLinkPress = async () => {
    if (!(await form.validate())) {
      return;
    }

    // Call api to get link
    try {
      const urlResp = await shareMutation.mutateAsync({
        couponId: props.id,
        name: nameField.value,
      });
      props?.onSendSuccess(urlResp);
    } catch (err) {
      Alert.alert('Error', err?.message);
      console.error(err);
    }
  };

  return (
    <View style={st.sendForm}>
      <View style={st.inputWrapper}>
        <MonInput
          style={st.input}
          error={nameField.hasError}
          helperText={nameField.errorText}
          value={nameField.value}
          onChangeText={nameField.onChange}
          placeholder="Enter a url ..."
        />
      </View>
      {shareMutation.isFetching ? (
        <View style={st.buttonContainer}>
          <ActivityIndicator size={'large'} color={'black'} />
        </View>
      ) : (
        <View style={st.buttonContainer}>
          <BasicButton onActionPress={onGetLinkPress}>
            {() => {
              return (
                <SendIcon
                  width={st.sendBtnIcon.width}
                  height={st.sendBtnIcon.height}
                />
              );
            }}
          </BasicButton>
        </View>
      )}
    </View>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  input: {
    ...theme.monInputRoundedStyle,
  },
  inputWrapper: {
    flex: 1,
  },
  sendForm: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    paddingLeft: 19,
  },
  sendBtnIcon: {
    width: 40,
    height: 34,
  },
}));
