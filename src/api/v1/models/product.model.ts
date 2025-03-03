import mongoose, { Schema } from 'mongoose';
import { IProduct } from '@interfaces/IEntity';


const ProductSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
});
const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product