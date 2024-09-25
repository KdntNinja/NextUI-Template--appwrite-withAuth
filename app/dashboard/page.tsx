"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "../appwrite";
import { siteConfig } from "@/config/site";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { Button, Input } from "@nextui-org/react";

interface User {
 name: string;
 emailVerification: boolean;
 $id: string;
}

interface Repository {
 id: string;
 name: string;
 description: string;
}

const Dashboard = () => {
 const [user, setUser] = useState<User | null>(null);
 const [repositories, setRepositories] = useState<Repository[]>([]);
 const [newRepoName, setNewRepoName] = useState("");
 const [newRepoDescription, setNewRepoDescription] = useState("");
 const router = useRouter();

 useEffect(() => {
  const checkAuthentication = async () => {
   try {
    const session = await account.getSession("current");
    if (!session) {
     router.push(siteConfig.routes.login);
    } else {
     const userData = await account.get();
     setUser(userData as User);
     if (!userData.emailVerification) {
      router.push(siteConfig.routes.verify);
     } else {
      fetchRepositories();
     }
    }
   } catch (error) {
    console.error("Failed to fetch user data:", error);
    router.push(siteConfig.routes.login);
   }
  };

  const fetchRepositories = async () => {
   try {
    const response = await fetch("/api/repositories");
    if (!response.ok) {
     throw new Error("Failed to fetch repositories");
    }
    const data = await response.json();
    setRepositories(data);
   } catch (error) {
    console.error("Failed to fetch repositories:", error);
   }
  };

  checkAuthentication();
 }, [router]);

 const handleCreateRepository = async () => {
  if (!user) return;

  try {
   const response = await fetch("/api/create-repo", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: user.$id, name: newRepoName, description: newRepoDescription }),
   });

   if (!response.ok) {
    throw new Error("Failed to create repository");
   }

   const newRepo = await response.json();
   setRepositories([...repositories, newRepo]);
   setNewRepoName("");
   setNewRepoDescription("");
  } catch (error) {
   console.error("Failed to create repository:", error);
  }
 };

 if (!user) {
  return <Skeleton />;
 }

 return (
  <div className="min-h-screen text-white">
   <section className="flex flex-col items-center justify-center gap-6 py-12 md:py-16">
    <div className="text-center max-w-2xl">
     <h1 className="text-3xl font-bold mb-4">
      Welcome to Versionary, {user.name}!
     </h1>
    </div>
    <div className="w-full flex flex-col gap-4 max-w-4xl">
     <Card className="shadow-lg border border-gray-200 rounded-lg w-full">
      <CardHeader className="font-semibold text-base text-white p-6 border-b border-gray-200">
       Your Repositories
      </CardHeader>
      <CardBody className="p-6">
       {repositories.length > 0 ? (
        repositories.map((repo) => (
         <div key={repo.id} className="mb-4">
          <p className="text-white">{repo.name}</p>
          <p className="text-white">{repo.description}</p>
         </div>
        ))
       ) : (
        <p className="text-white">No repositories found.</p>
       )}
      </CardBody>
     </Card>
     <Card className="shadow-lg border border-gray-200 rounded-lg w-full mt-4">
      <CardHeader className="font-semibold text-base text-white p-6 border-b border-gray-200">
       Create New Repository
      </CardHeader>
      <CardBody className="p-6">
       <Input
        fullWidth
        label="Repository Name"
        value={newRepoName}
        onChange={(e) => setNewRepoName(e.target.value)}
        className="mb-4"
       />
       <Input
        fullWidth
        label="Repository Description"
        value={newRepoDescription}
        onChange={(e) => setNewRepoDescription(e.target.value)}
        className="mb-4"
       />
       <Button onClick={handleCreateRepository} color="primary">
        Create Repository
       </Button>
      </CardBody>
     </Card>
    </div>
   </section>
  </div>
 );
};

export default Dashboard;