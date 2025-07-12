import React from "react";
import Navbar from "../../../components/Navbar";
import { ModalProvider } from "../../../components/ModalContext";
import ProfileModal from "../../../components/ProfileModal";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModalProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>

        <ProfileModal />
      </div>
    </ModalProvider>
  );
}
