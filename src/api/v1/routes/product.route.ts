import { Router } from 'express';
import { authMiddleware, checkRole } from '@middlewares/auth.middleware';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    listProducts
} from '@controllers/product.controller';

const productRouter = Router();

productRouter.get('/list', authMiddleware, listProducts);

productRouter.post('/create', authMiddleware, checkRole(1), createProduct);
productRouter.put('/update/:id', authMiddleware, checkRole(1), updateProduct);
productRouter.delete('/delete/:id', authMiddleware, checkRole(1), deleteProduct);

export default productRouter;