import React, {useState} from 'react';
import {Text, StyleSheet, Pressable, ActivityIndicator} from 'react-native';

interface ActionableTextProp {
  text: string;
  actionText: string;
  onActionPress: () => void;
}

export const ActionableText = React.memo(
  ({text, actionText, onActionPress}: ActionableTextProp) => {
    const [isLoading, setIsLoading] = useState(false);
    return (
      <>
        <Text style={st.actionText}>{text}</Text>
        <Pressable
          onPress={async () => {
            try {
              setIsLoading(true);
              await Promise.resolve(onActionPress());
            } finally {
              setIsLoading(false);
            }
          }}
          style={({pressed}) => [
            st.actionbtn,
            {
              opacity: pressed || isLoading ? 0.6 : 1,
            },
          ]}>
          {isLoading ? (
            <ActivityIndicator size={'small'} color={'white'} />
          ) : (
            <Text style={st.actionbtnText}>{actionText}</Text>
          )}
        </Pressable>
      </>
    );
  },
);

const st = StyleSheet.create({
  actionbtn: {
    flexDirection: 'row',
    backgroundColor: '#4fbfe8',
    borderRadius: 3,
    padding: 5,
  },
  actionbtnText: {
    fontSize: 15,
  },
  actionText: {
    fontSize: 15,
    marginBottom: 15,
  },
});
