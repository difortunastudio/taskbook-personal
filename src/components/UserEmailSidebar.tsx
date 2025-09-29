"use client";
import { useSession } from "next-auth/react";

export default function UserEmailSidebar() {
  const { data: session } = useSession();
  if (!session?.user?.email) return null;
  return (
    <div className="mt-8 text-xs text-gray-700 text-center break-all">
      <span className="font-semibold">Usuario:</span> {session.user.email}
    </div>
  );
}
