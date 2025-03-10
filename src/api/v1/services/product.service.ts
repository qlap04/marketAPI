import Product from "@models/product.model";
import { IProduct } from "@interfaces/IEntity";

const createProductService = async (productData: Partial<IProduct>) => {
    const exists = await Product.findOne({ title: productData.title });
    if (exists) {
        return { success: false, message: 'The product already exists.' };
    }
    try {
        const product = new Product(productData);
        await product.save();
        return { success: true, message: 'Product added successfully.' };
    } catch (error) {
        return { success: false, message: 'Error adding product.' };
    }
};

const updateProductService = async (productId: string, updatedData: Partial<IProduct>) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
        if (!updatedProduct) {
            return { success: false, message: 'Product not found.' };
        }
        return { success: true, message: 'Product updated successfully.' };
    } catch (error) {
        return { success: false, message: 'Error updating product.' };
    }
};

const deleteProductService = async (productId: string) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return { success: false, message: 'Product not found.' };
        }
        return { success: true, message: 'Product deleted successfully.' };
    } catch (error) {
        return { success: false, message: 'Error deleting product.' };
    }
};

const showListProductService = async () => {
    try {
        const products = await Product.find();
        if (products.length === 0) {
            return { success: false, message: 'No products found.' };
        }
        return { success: true, products };
    } catch (error) {
        return { success: false, message: 'Error fetching products.' };
    }
};

export {
    createProductService,
    updateProductService,
    deleteProductService,
    showListProductService
};