"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/app/appwrite";
import { siteConfig } from "@/config/site";

const VerifyPage = () => {
  const [message, setMessage] = useState("Verifying...");
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");

    if (userId && secret) {
      account
        .updateVerification(userId, secret)
        .then(() => {
          setMessage("Email verified successfully!");
          router.push(siteConfig.routes.dashboard);
        })
        .catch((error) => {
          console.error("Verification failed:", error);
          setMessage("Verification failed. Please try again.");
        });
    } else {
      setMessage("Invalid verification link.");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-[25px] font-bold mb-6">Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyPage;