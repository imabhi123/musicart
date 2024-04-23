import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/db/db";
import User from "@/models/user-model";
import { getDataFromToken } from "@/utils/getDataFromToken";

connectToDB()

export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return NextResponse.json({
                error: 'User not found'
            }, { status: 401 });
        }

        return NextResponse.json({
            message: "User found",
            data: user,
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}