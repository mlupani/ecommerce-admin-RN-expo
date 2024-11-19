import React, { createContext, useEffect, useState } from 'react';
import { ImagePickerResponse } from 'react-native-image-picker';
import productosAPI from '../api/productosApi';
import { Categoria, CategoriasResponse } from '../interfaces/interfaces';
import { ImagePickerAsset } from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type categoryContextProps = {
  categories: Categoria[];
  loadCategoryById: (categoryID: string) => Promise<Categoria>;
  addCategory: (nombre: string, descripcion: string) => Promise<Categoria>;
  updateCategory: (
    id: string,
    nombre: string,
    descripcion: string,
    img: string,
  ) => void;
  uploadImage: (data: any, id: string) => Promise<string | undefined>;
  loadCategories: () => Promise<void>;
};

export const categoryContext = createContext({} as categoryContextProps);

export const CategoryContextProvider = ({ children }: any) => {
  const [categories, setCategories] = useState<Categoria[]>([]);

  useEffect(() => {
    loadCategories();
  }, [])
  

  const loadCategoryById = async (categoryID: string): Promise<Categoria> => {
    const resp = await productosAPI.get<Categoria>(`/categorias/${categoryID}`);
    return resp.data;
  };

  const loadCategories = async () => {
    try {
      const resp = await productosAPI.get<CategoriasResponse>('/categorias');
      setCategories(resp.data.categorias);
    } catch (error) {
      console.log(error)
    }
  };

  const addCategory = async (
    nombre: string,
    descripcion: string,
  ): Promise<Categoria> => {
    try {
      const resp = await productosAPI.post<Categoria>('/categorias', {
        nombre,
        descripcion,
      });
      return resp.data;
    } catch (error) {
      console.log(error);
      return null!;
    }
  };

  const uploadImage = async (data: ImagePickerAsset, id: string) => {

    const fileToUpload = {
      uri: data.uri,
      type: 'image/jpeg',
      name: data.uri.split('/').pop(),
    };

    const formData = new FormData();
    formData.append('archivo', fileToUpload);
    console.log(formData)

    try {
      const resp = await productosAPI.put<Categoria>(
        `/uploads/categorias/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return resp.data.img;
    } catch (error) {
      console.log(error);
    }
  };

  const updateCategory = (
    id: string,
    nombre: string,
    descripcion: string,
    img: string,
  ) => {
    productosAPI.put(`/categorias/${id}`, {
      nombre,
      descripcion,
      img,
    });
  };

  return (
    <categoryContext.Provider
      value={{
        categories,
        loadCategoryById,
        addCategory,
        updateCategory,
        uploadImage,
        loadCategories
      }}>
      {children}
    </categoryContext.Provider>
  );
};
