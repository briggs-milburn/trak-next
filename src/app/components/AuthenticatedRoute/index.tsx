"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

// This component checks if the user is authenticated and redirects to the login page if not
export const Authentication = () => {
    const route = useRouter();
    useEffect(() => {
        async function checkAuth() {
            const res = await fetch("/api/auth/me");
            console.log("Auth check response:", res);
            if (!res.ok) {
                route.push("/login");
            }
        }
        checkAuth();
    }, []);

    return (
        <></>
    );
};
