import { Request, Response } from 'express';
import { createProductService, addBulkProductsService, updateProductService, deleteProductService, showListProductService } from '@services/product.service'; // Assuming services are in product.service.ts

// Informational responses (100 – 199)
// Successful responses (200 – 299)
// Redirection messages (300 – 399)
// Client error responses (400 – 499)
// Server error responses (500 – 599)

const createProduct = async (req: Request, res: Response) => {
    try {
        const productData = req.body;
        const result = await createProductService(productData);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// 
const addBulkProducts = async (req: Request, res: Response) => {
    try {
        const products = req.body;
        const result = await addBulkProductsService(products);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Error adding bulk products:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// 
const updateProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const updatedData = req.body;
        const result = await updateProductService(productId, updatedData);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// 
const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const result = await deleteProductService(productId);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// 
const showListProduct = async (req: Request, res: Response) => {
    try {
        const result = await showListProductService();
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Error fetching product list:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
