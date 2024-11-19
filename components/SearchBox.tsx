import React, { useState } from 'react';
import {StyleSheet, TextInput } from 'react-native';

const SearchBox = () => {
  const [search, setSearch] = useState('');

  const handleChange = (value: string) => {
    setSearch(value);
  };

  return (
    <TextInput
      onChangeText={handleChange}
      value={search}
      placeholder={'Buscar'}
      style={{
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        borderRadius: 100,
        paddingLeft: 20,
        marginVertical: 20,
        color: 'black',
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default SearchBox;
