import {auth} from "@/auth";
import {NextResponse} from "next/server";


export async function middleware(){
    const session = await auth();
    if(!session){
        return NextResponse.redirect('http://localhost:3000/onboarding');
    }
}

export const config = {
    matcher: ['/home/:path*'],
}