"use server";

import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
        "INSERT INTO users (email, username, password_hash, display_name) VALUES ($1, $2, $3, $4)",
        [email, username, passwordHash, username]
    );

    redirect("/login");
}