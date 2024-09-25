"use client";

import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { Databases, Account } from "appwrite";
import { client } from "@/app/appwrite";

const CreateRepo = () => {
    const [repoName, setRepoName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (repoName.trim().length === 0) {
            setError("Repository name cannot be empty.");
            return;
        }
        setLoading(true);
        setError(null);

        const databases = new Databases(client);
        const account = new Account(client);

        try {
            const userData = await account.get();
            const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID as string;
            const collectionId = process.env.NEXT_PUBLIC_REPO_COLLECTION_ID as string;

            await databases.createDocument(databaseId, collectionId, 'unique()', {
                name: repoName,
                ownerId: userData.$id,
                isPrivate: true,
            });
            router.push("/dashboard");
        } catch (error) {
            console.error("Error creating repository:", error);
            setError("Failed to create repository. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Create Repository</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Repository Name"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    required
                />
                {error && <div className="text-red-500">{error}</div>}
                <Button isLoading={loading} type="submit">
                    Create Repository
                </Button>
            </form>
        </div>
    );
};

export default CreateRepo;
