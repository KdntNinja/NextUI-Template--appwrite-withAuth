"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Databases } from "appwrite";
import { client, account } from "@/app/appwrite";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import Typography from "@/components/Typography";

const CreateRepo = () => {
	const [repoName, setRepoName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				await account.get();
			} catch (error) {
				console.error("User not authenticated:", error);
				router.push("/login");
			}
		};
		checkAuth();
	}, [router]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (repoName.trim().length === 0) {
			setError("Repository name cannot be empty.");
			return;
		}
		setLoading(true);
		setError(null);

		const databases = new Databases(client);

		try {
			const userData = await account.get();
			console.log("User Data:", userData); // Log user data
			const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID as string;
			const collectionId = process.env.NEXT_PUBLIC_REPO_COLLECTION_ID as string;

			const documentData = {
				name: repoName,
				ownerId: userData.$id,
				isPrivate: true,
			};

			console.log("Creating document with data:", documentData); // Log document data

			await databases.createDocument(
				databaseId,
				collectionId,
				"unique()",
				documentData,
			);
			router.push("/dashboard");
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error("Error creating repository:", err.message);
				setError("Failed to create repository. Please try again.");
			} else {
				console.error("Unexpected error:", err);
				setError("An unexpected error occurred. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
			<Card>
				<CardBody>
					<Typography h2>Create Repository</Typography>
					<form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
						<Input
							label="Repository Name"
							value={repoName}
							onChange={(e) => setRepoName(e.target.value)}
							required
							style={{ marginBottom: "15px" }} // Add margin for spacing
						/>
						{error && (
							<div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
						)}
						<Button isLoading={loading} type="submit" color="primary" fullWidth>
							{loading ? <Spinner size="sm" /> : "Create Repository"}{" "}
							{/* Show spinner during loading */}
						</Button>
					</form>
				</CardBody>
			</Card>
		</div>
	);
};

export default CreateRepo;
