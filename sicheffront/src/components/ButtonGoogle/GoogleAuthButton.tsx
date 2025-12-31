"use client";
import { signIn } from "next-auth/react";
import { setCookie } from "cookies-next";

export const GoogleAuthButton = ({
  roleIntent,
  label,
}: {
  roleIntent: "USER" | "CREATOR";
  label?: string;
}) => {
  const handleGoogle = () => {
    setCookie("selected_role", roleIntent, {
      maxAge: 300,
      path: "/",
    });

    signIn("google", {
      callbackUrl: roleIntent === "CREATOR" ? "/creator" : "/guest",
    });
  };

  return (
   <div className="flex items-center justify-center">
              <button
                type="button"
                className="flex items-center justify-center w-14 h-14 bg-[#543C2A] rounded-full transition-transform duration-200 hover:scale-110"
                onClick={handleGoogle}
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.805 10.038C21.925 10.686 22 11.35 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C14.706 2 17.11 3.09 18.84 4.88L15.342 8.378C14.398 7.493 13.28 7 12 7C9.239 7 7 9.239 7 12C7 14.761 9.239 17 12 17C14.398 17 16.327 15.34 16.839 13.195H12V10H21.805V10.038Z"
                    fill="#D2B48C"
                  />
                </svg>
              </button>
            </div>
  );
};
