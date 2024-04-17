import mongoose from "mongoose";

export async function connectToDB(){
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection=mongoose.connection;

        connection.on('connected',()=>{
            console.log('successfully connected to mongo');
        })
       
        connection.on('error',(err)=>{
            console.log('mongodb connection error, please make sure db is up and running',err);
            process.exit();
        })
    } catch (error) {
        console.log('something went wrong in connecting to db');
        console.log(error);
    }
}