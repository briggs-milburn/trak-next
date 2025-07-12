import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  let payload: { userId: number; email: string };
  try {
    payload = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };
  } catch {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      email: true,
      profile: true
    }
  });

  if (!user) redirect("/login");

  return (
    <div className="card max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <dl>
        <dt className="font-semibold">First Name:</dt>
        <dd className="mb-4">{user.profile?.firstName || "N/A"}</dd>

        <dt className="font-semibold">Last Name:</dt>
        <dd className="mb-4">{user.profile?.lastName || "N/A"}</dd>

        <dt className="font-semibold">Email:</dt>
        <dd>{user.email}</dd>
      </dl>
    </div>
  );
}
