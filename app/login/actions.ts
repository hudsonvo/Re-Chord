"use server";

import {signIn} from "@/auth";

export async function login(formData: FormData) {
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
        identifier,
        password,
        redirectTo: "/",
    });
}