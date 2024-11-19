import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://ecommerce-server-gray.vercel.app/api';
//const baseURL = 'https://10.0.2.2:3000/api';
const productosAPI = axios.create({ baseURL });

productosAPI.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers['x-token'] = token;
  }

  return config;
});

export default productosAPI;
