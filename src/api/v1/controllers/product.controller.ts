import { Request, Response } from 'express';
import {
    createProductService,
    updateProductService,
    deleteProductService,
    showListProductService
} from '@services/product.service';

const createProduct = async (req: Request, res: Response) => {
    try {
        const response = await createProductService(req.body);
        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

const updateProduct = async (req: Request, res: Response) => {
    try {
        const response = await updateProductService(req.params.id, req.body);
        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const response = await deleteProductService(req.params.id);
        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

const listProducts = async (req: Request, res: Response) => {
    try {
        const response = await showListProductService();
        res.status(response.success ? 200 : 404).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export {
    createProduct,
    updateProduct,
    deleteProduct,
    listProducts
};