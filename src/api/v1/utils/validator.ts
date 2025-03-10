import { z } from 'zod'

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 character')
})

const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const productSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    image: z.string().url('Invalid image URL'),
    quantity: z.number().int().min(0, 'Quantity must be non-negative'),
});

const bulkProductsSchema = z.array(productSchema).min(1, 'At least one product is required');

const refreshTokenSchema = z.object({
    refresh_token: z.string().min(1, 'Refresh token is required'),
});

export {
    registerSchema,
    loginSchema,
    productSchema,
    bulkProductsSchema,
    refreshTokenSchema
};