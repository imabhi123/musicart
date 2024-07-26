import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectToDB } from "@/db/db";
import User from "@/models/user-model";
import jwt from 'jsonwebtoken';

connectToDB();

export async function POST(request: NextRequest) {
    // CORS Handling
    const headers = new Headers();
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
            return new NextResponse(
                JSON.stringify({ error: "Email and password are required" }), 
                { 
                    status: 400, 
                    headers 
                }
            );
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return new NextResponse(
                JSON.stringify({ error: "User does not exist" }), 
                { 
                    status: 400, 
                    headers 
                }
            );
        }

        // Verify password
        const validPass = await bcryptjs.compare(password, user.password);
        if (!validPass) {
            return new NextResponse(
                JSON.stringify({ error: "Invalid credentials" }), 
                { 
                    status: 400, 
                    headers 
                }
            );
        }

        // Create and sign JWT token
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1h' });

        // Create response
        const response = new NextResponse(
            JSON.stringify({
                message: "Logged in successfully",
                success: true
            }),
            {
                status: 200,
                headers: {
                    ...headers,
                    'Set-Cookie': `token=${token}; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''} SameSite=Lax`
                }
            }
        );

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return new NextResponse(
            JSON.stringify({ error: "An unexpected error occurred" }), 
            { 
                status: 500, 
                headers 
            }
        );
    }
}
