import React, { useEffect, useContext, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import useCategories from '../../hooks/useCategories';
import { useForm } from '../../hooks/useForm';
import { productsContext } from '../../context/productsContext';
import Button from '../../components/Button';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const ProductScreen = () => {
  const { name, id } = useLocalSearchParams();
  const { categories, isLoading } = useCategories();
  const {
    loadProductById,
    addProduct,
    updateProduct,
    uploadImage,
    categorySelected,
  } = useContext(productsContext);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [updating, setUpdating] = useState(false);
  const {
    _id,
    nombre,
    categoriaID,
    img,
    descripcion,
    precio,
    stock,
    form,
    onChange,
    setForm,
  } = useForm({
    _id: id,
    nombre: name,
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaID: '',
    img: '',
  });
  const [tempPhoto, setTempPhoto] = useState('');

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    if (!id) {
      setLoadingProduct(false);
      return;
    }
    const product = await loadProductById((id as string));
    setForm({
      _id: id,
      nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      categoriaID: product.categoria._id,
      img: product.img || '',
    });
    setLoadingProduct(false);
  };

  const saveOrUpdate = async () => {
    setUpdating(true);
    const tempCategoria = categoriaID ? categoriaID : categories[0]._id;
    if (id) {
      await updateProduct(
        id as string,
        tempCategoria,
        (nombre as string) || '',
        descripcion,
        stock,
        precio,
      );
      setUpdating(false);
    } else {
      const newProd = await addProduct(
        tempCategoria,
        nombre as string ?? '',
        descripcion,
        stock,
        precio,
      );
      onChange(newProd._id, '_id');
      setUpdating(false);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.5,
      cameraType: ImagePicker.CameraType.back,
    })

    if(!result.canceled)
      {
        setTempPhoto(result.assets[0].uri);
        uploadImage(result.assets[0], (_id as string)!);
      }
  };

  const takePhotoFromGallery = async  () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'livePhotos'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.5,
    });

    if(!result.canceled)
    {
      setTempPhoto(result.assets[0].uri);
      const url = await uploadImage(result.assets[0], (_id as string)!);
      if(url){
        setForm({...form, img: url});
      }
    }
  };

  if (isLoading || loadingProduct) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'black'} size={50} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: nombre ? (nombre as string) : 'Nombre de producto'}} />
      <View style={{ flex: 1, marginTop: 20, marginHorizontal: 20 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {img.length > 0 || tempPhoto ? (
            <Image
              source={{ uri: tempPhoto ? tempPhoto : img }}
              resizeMode={'contain'}
              style={{
                flex: 1,
                height: 250,
                width: 250,
                borderRadius: 50,
                marginBottom: 20,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            />
          ) : null}

          {_id ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 20,
              }}>
              <Button text={'Tomar foto'} onPress={takePhoto} />
              <Button
                text={'Seleccionar una imagen'}
                onPress={takePhotoFromGallery}
              />
            </View>
          ) : null}

          <Text style={{ fontSize: 16 }}>Nombre del producto</Text>
          <TextInput
            placeholder={'Nombre del producto'}
            placeholderTextColor="#beb9b9"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              borderRadius: 100,
              paddingLeft: 20,
              marginVertical: 20,
              color: 'black',
            }}
            value={(nombre as string)}
            onChangeText={value => onChange(value, 'nombre')}
          />

          <Text style={{ fontSize: 16 }}>Descripcion del producto</Text>
          <TextInput
            multiline={true}
            numberOfLines={3}
            placeholder={'Descripcion del producto'}
            placeholderTextColor="#beb9b9"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              borderRadius: 40,
              paddingLeft: 20,
              marginVertical: 20,
              color: 'black',
            }}
            value={descripcion}
            onChangeText={value => onChange(value, 'descripcion')}
          />

          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Categoria</Text>

          <Picker
            selectedValue={categoriaID ? categoriaID : categorySelected?._id}
            onValueChange={value => onChange(value, 'categoriaID')}>
            {categories.map(cat => (
              <Picker.Item key={cat._id} label={cat.nombre} value={cat._id} />
            ))}
          </Picker>

          <Text style={{ fontSize: 16 }}>Precio</Text>
          <TextInput
            placeholder={'Precio'}
            placeholderTextColor="#beb9b9"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              borderRadius: 100,
              paddingLeft: 20,
              marginVertical: 20,
              color: 'black',
            }}
            value={precio.toString()}
            onChangeText={value => onChange(value, 'precio')}
          />

          <Text style={{ fontSize: 16 }}>Stock</Text>
          <TextInput
            placeholder={'Stock'}
            placeholderTextColor="#beb9b9"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              borderRadius: 100,
              paddingLeft: 20,
              marginVertical: 20,
              color: 'black',
            }}
            value={stock.toString()}
            onChangeText={value => onChange(value, 'stock')}
          />

          <View style={{ marginBottom: 20 }}>
            {updating ? (
              <ActivityIndicator color={'black'} size={50} />
            ) : (
              <View style={{gap: 20}}>
                <Button text={'Guardar'} onPress={saveOrUpdate} />
                {/* <Button text={'Cancelar'} onPress={() => router.navigate({
                  pathname: '/(app)',
                })} /> */}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ProductScreen;
