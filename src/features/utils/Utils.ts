import {Alert} from 'react-native';

export const confirmAlert = (
  title: string,
  confirmText: string,
  rejectText: string,
  message: string,
) => {
  return new Promise<boolean>((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: confirmText,
          onPress: () => resolve(true),
        },
        {
          text: rejectText,
          onPress: () => resolve(false),
        },
      ],
      {cancelable: true, onDismiss: () => resolve(false)},
    );
  });
};
