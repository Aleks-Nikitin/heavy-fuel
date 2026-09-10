"use server";

import { auth } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function getAllOrders(){
    const session = await auth.api.getSession();
    if(!session?.user?.id){
        throw new Error("User not authenticated");
    }
    if(session){
        try{
            let orders;
            if(session.user.isAdmin){
                //  orders= await prisma.order.findMany();
                // return orders;
            }
            // orders= await prisma.order.findMany({
            //     where:{
            //         userId: session.user.id
            //     }
            // });
            // return orders;
        }
        catch(error){

        }
    }
}