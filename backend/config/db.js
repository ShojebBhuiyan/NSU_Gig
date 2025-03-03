import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://admin:admin@cluster0.aj1tl.mongodb.net/Food_Delivery_Website').then(()=>console.log("DataBase Connected"));
}
//mongodb+srv://admin:admin@cluster0.aj1tl.mongodb.net/Food_Delivery_Website
//mongodb+srv://air:admin@cluster0.7aavp.mongodb.net/food_website