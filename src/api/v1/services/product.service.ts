import Product from "@models/product.model";
import { IProduct } from "@interfaces/IEntity";

const createProductService = async (productData: Partial<IProduct>) => {
    const exists = await Product.findOne({ title: productData.title })
    if (!exists) {
        return { success: false, message: 'The product already exists.' };
    }
    try {
        const product = new Product(productData);
        await product.save()
        return { success: true, message: 'Product added' };
    } catch (error) {
        return { success: false, message: 'Error adding product' };
    }
}

const addBulkProductsService = async (products: Partial<IProduct>[]) => {
    if (!products || !Array.isArray(products)) {
        return { success: false, message: "Invalid input" };
    }

    try {
        const productPromises = products.map(product => {
            const newProduct = new Product();
            return newProduct.save();
        });

        await Promise.all(productPromises);
        return { success: true, message: 'Products added successfully' };
    } catch (error) {
        console.error('Error adding products:', error);
        return { success: false, message: 'Error adding products' };
    }
};

const updateProductService = async (productId: String, updatedData: Partial<IProduct>) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
        if (!updatedProduct) {
            return { success: false, message: 'Product not found' };
        }
        return { success: true, message: 'Updated' };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, message: 'Error updating user' };
    }
}

const deleteProductService = async (productId: string) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return { success: false, message: 'Product not found' };
        }
        return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, message: 'Error deleting product' };
    }
};

const showListProductService = async () => {
    try {
        const products = await Product.find();
        if (products.length === 0) {
            return { success: false, message: 'No products found' };
        }
        return { success: true, products };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, message: 'Error fetching products' };
    }
};

export {
    createProductService,
    showListProductService,
    updateProductService,
    deleteProductService,
    addBulkProductsService
}