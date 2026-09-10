"use server";
import { auth } from "@/lib/auth";
import {headers} from "next/headers";
export async function signUp(
  name: string,
  email: string,
  password: string,
  callbackUrl="/",
) {
    try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        callbackURL: callbackUrl,
      },
    });
    return result;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw new Error("Failed to sign up with email");
  }
}
export async function signInWithEmail(
  email: string,
  password: string,
  callbackUrl="/",
) {
    try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: callbackUrl,
      },
    });
    return result;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw new Error("Failed to sign in with email");
  }
}
export async function signOut(){
  try {
    const result = await auth.api.signOut(
    {headers: await headers()});
    return result;
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out");
  }
}
