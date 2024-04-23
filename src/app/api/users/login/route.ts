import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectToDB } from "@/db/db";
import User from "@/models/user-model";
import jwt from 'jsonwebtoken'

connectToDB()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, password } = reqBody
        //validation
        console.log(reqBody);

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "user does not exists" }, { status: 400 });
        }
        console.log('user exists');

        const validPass = await bcryptjs.compare(password, user.password);

        if (!validPass) {
            return NextResponse.json({ error: "please check your credentials" }, { status: 400 });
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1h' });

        const response = NextResponse.json({
            message: "Logged in success",
            success: true
        })

        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}