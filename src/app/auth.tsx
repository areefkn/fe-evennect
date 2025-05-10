"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

import { onLogin } from "@/lib/redux/features/authSlice";
import React from "react";

export default function Auth({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  const refreshLogin = async () => {
    const access_token = getCookie("access_token") as string;

    if (access_token) {
      const decoded: any = jwtDecode(access_token);
      
      dispatch(
        onLogin({
          user: {
            email: decoded.email,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            role: decoded.role,
            avatar: decoded.profile_pict || "",
          },
          isLogin: true,
        })
      );
    }
  };

  useEffect(() => {
    refreshLogin();
  }, []);

  return <>{children}</>;
}
