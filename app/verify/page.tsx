"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/app/appwrite";
import { siteConfig } from "@/config/site";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";

const VerifyPage = () => {
 const [message, setMessage] = useState("Verifying...");
 const [loading, setLoading] = useState(true);
 const router = useRouter();

 useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  const secret = urlParams.get("secret");

  if (userId && secret) {
   account
    .updateVerification(userId, secret)
    .then(async () => {
     const userData = await account.get();
     if (userData.emailVerification) {
      setMessage("Email verified successfully! Redirecting to dashboard...");
      setTimeout(() => {
       router.push(siteConfig.routes.dashboard);
      }, 3000);
     } else {
      setMessage("Email verification failed. Please try again.");
     }
    })
    .catch((error) => {
     console.error("Verification failed:", error);
     setMessage("Verification failed. Please try again or contact support.");
    })
    .finally(() => {
     setLoading(false);
    });
  } else {
   setMessage("Invalid verification link, Check your email.");
   setLoading(false);
  }
 }, [router]);

 return (
  <div className="flex flex-col items-center justify-start min-h-screen">
   <Card className="w-full max-w-md shadow-lg mx-auto mt-8">
    <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-t-lg text-2xl font-bold text-center">
     <h1 className="text-2xl font-bold text-center">Email Verification</h1>
    </CardHeader>
    <CardBody className="flex items-center justify-center p-6 text-center">
     {loading ? (
      <Spinner size="lg" className="mb-4" />
     ) : (
      <p className="text-lg">{message}</p>
     )}
    </CardBody>
   </Card>
  </div>
 );
};

export default VerifyPage;