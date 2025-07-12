import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    redirect("/login");
  }

  return (
    <div className="card max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>This is your settings page.</p>
      {/* Add settings form here */}
    </div>
  );
}
