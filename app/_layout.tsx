import { AuthProvider } from "@/context/authContext";
import { CategoryContextProvider } from "@/context/categoriesContext";
import { ProductsContextProvider } from "@/context/productsContext";
import { Slot } from "expo-router";


export default function Root() {
return (
    <AuthProvider>
        <ProductsContextProvider>
        <CategoryContextProvider>
            <Slot />
        </CategoryContextProvider>
        </ProductsContextProvider>
    </AuthProvider>
)
}