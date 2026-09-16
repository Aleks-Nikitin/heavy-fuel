"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export async function updateProfile(name: string, email: string) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session) {
      throw new Error("Unauthorized access request.");
    }

    const updatedUser = await auth.api.updateUser({
      body: {
        name,
      },
      headers: headersList,
    });

    const currentEmail = session.user.email;
    if (email && email.trim().toLowerCase() !== currentEmail.toLowerCase()) {
      await auth.api.changeEmail({
        body: {
          newEmail: email.trim(),
        },
        headers: headersList,
      });
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
}

export async function deleteAccount() {
  try {
    await auth.api.deleteUser({
      body: {},
      headers: await headers(),
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    throw new Error("Failed to delete account");
  }
}
