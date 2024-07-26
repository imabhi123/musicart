import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectToDB } from "@/db/db";
import User from "@/models/user-model";
import jwt from 'jsonwebtoken';

connectToDB();

export async function POST(request: NextRequest) {
    // CORS Handling
    const headers = new Headers(request.headers);
    headers.set('Access-Control-Allow-Origin', '*'); // Adjust based on your security needs
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') {
        // Pre-flight request
        return new NextResponse(null, {
            status: 204,
            headers
        });
    }

    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Basic validation
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400, headers });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400, headers });
        }

        // Verify password
        const validPass = await bcryptjs.compare(password, user.password);
        if (!validPass) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400, headers });
        }

        // Create and sign JWT token
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1h' });

        // Create response
        const response = NextResponse.json({
            message: "Logged in successfully",
            success: true
        });

        // Set token in HTTP-only cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            sameSite: 'Lax'
        });

        response.headers = headers;

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500, headers });
    }
}
