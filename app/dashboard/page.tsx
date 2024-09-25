"use client";

import React, { useEffect, useState } from "react";
import { account, databases, client } from "@/app/appwrite";
import {
	Button,
	Card,
	CardBody,
	Spacer,
	Spinner,
	Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Query, Storage } from "appwrite";
import FileUpload from "./repo/[repoId]/FileUpload";

const Dashboard = () => {
	const [user, setUser] = useState<any | null>(null);
	const [repositories, setRepositories] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				const userData = await account.get();
				setUser(userData);
				await fetchRepositories(userData.$id);
			} catch (error: any) {
				console.error("Error fetching user data:", error);
				setError("Failed to fetch user data. Redirecting to login.");
				setTimeout(() => {
					router.push(siteConfig.routes.login);
				}, 2000);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [router]);

	const fetchRepositories = async (userId: string) => {
		const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID as string;
		const collectionId = process.env.NEXT_PUBLIC_REPO_COLLECTION_ID as string;

		try {
			const response = await databases.listDocuments(databaseId, collectionId, [
				Query.equal("ownerId", userId),
			]);
			setRepositories(response.documents);
		} catch (error) {
			console.error("Error fetching repositories:", error);
			setError("Failed to fetch repositories.");
		}
	};

	const deleteRepository = async (repoId: string) => {
		const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID as string;
		const collectionId = process.env.NEXT_PUBLIC_REPO_COLLECTION_ID as string;
		const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string;

		try {
			const storage = new Storage(client); // Ensure client is passed correctly
			const filesResponse = await storage.listFiles(bucketId, [
				Query.equal("repoId", repoId),
			]);

			for (const file of filesResponse.files) {
				await storage.deleteFile(bucketId, file.$id);
			}

			await databases.deleteDocument(databaseId, collectionId, repoId);

			setRepositories((prev) => prev.filter((repo) => repo.$id !== repoId));

			router.push(`${siteConfig.routes.dashboard}/delete-repo`);
		} catch (error) {
			console.error("Error deleting repository:", error);
			setError("Failed to delete repository.");
		}
	};

	if (loading) {
		return (
			<Card>
				<CardBody className="text-center">
					<Spinner size="lg" />
					<Textarea readOnly value="Loading user data..." />
				</CardBody>
			</Card>
		);
	}

	return (
		<Card>
			<CardBody className="text-center">
				<h1>Dashboard</h1>
				{error ? (
					<p className="error">{error}</p>
				) : user ? (
					<>
						<h2>Welcome, {user?.name || "User"}!</h2>
						<Button
							onClick={() =>
								router.push(`${siteConfig.routes.dashboard}/create-repo`)
							}
							color="primary"
						>
							Create Repository
						</Button>
						<Spacer y={2} />
						<h3>Your Repositories</h3>
						{repositories.length > 0 ? (
							<ul className="repo-list">
								{repositories.map((repo) => (
									<li key={repo.$id} className="repo-item">
										<span>{repo.name}</span>
										<Button
											color="danger"
											onClick={() => deleteRepository(repo.$id)}
										>
											Delete
										</Button>
										<FileUpload
											userId={user.$id}
											repoName={repo.name}
											repoId={repo.$id}
										/>
									</li>
								))}
							</ul>
						) : (
							<p>No repositories found.</p>
						)}
					</>
				) : (
					<p>User not found.</p>
				)}
			</CardBody>
		</Card>
	);
};

export default Dashboard;
