import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../../context/authContext';
import { Stack } from 'expo-router';

const ProtectedScreen = () => {
  const { user, token, logOut } = useContext(AuthContext);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40,
        }}>
        <Text>Usuario logueado: </Text>
        <Text>
          {JSON.stringify(user, null, 5)}
          {token}
        </Text>
        <Button title={'Logout'} onPress={logOut} />
      </View>
    </>
  );
};

export default ProtectedScreen;
