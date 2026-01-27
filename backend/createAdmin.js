import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@saagaa.com" });

        if (existingAdmin) {
            console.log("❌ Admin user already exists with email: admin@saagaa.com");
            console.log("If you want to reset the password, delete the existing admin first.");
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const adminUser = await User.create({
            name: "Admin",
            email: "admin@saagaa.com",
            password: hashedPassword,
            role: "admin",
        });

        console.log("✅ Admin user created successfully!");
        console.log("📧 Email: admin@saagaa.com");
        console.log("🔑 Password: admin123");
        console.log("\n⚠️  IMPORTANT: Change this password after first login!");

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
};

createAdminUser();
