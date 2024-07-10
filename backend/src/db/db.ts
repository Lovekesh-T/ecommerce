import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect(
      `${process.env.MONGO_DB_URL}`,
      {
        dbName: process.env.DB_NAME,
      }
    );
    console.log(`Database is connected on ${connection.host}`);
  } catch (error) {
    console.log(`Database connection failed`);
    process.exit(1);
  }
};
