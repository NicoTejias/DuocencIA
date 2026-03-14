import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL);

async function checkUser() {
  try {
    const users = await client.query(api.admin.listAllUsers, { secret: process.env.ADMIN_SECRET || "dev" });
    console.log("Users in DB:", users);
  } catch (error) {
    console.error("Error checking users:", error);
  }
}

checkUser();
