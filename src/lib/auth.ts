import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Function to check if the request is authenticated
export const isAuthenticated = (request: NextRequest): boolean => {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return false;
    }
    console.log(token)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("JWT_SECRET is not defined in environment variables.");
        return false;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        return !!decoded;
    } catch(error)  {
        console.error("Authentication error:", error);
        return false;
    }
}