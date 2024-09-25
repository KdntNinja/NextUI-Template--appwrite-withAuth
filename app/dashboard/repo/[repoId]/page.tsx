"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Databases, Storage } from "appwrite";
import { client } from "@/app/appwrite";
import FileUpload from "./FileUpload";

const RepoPage = ({ params }: { params: { repoId: string } }) => {
	const { repoId } = params;
	const [repoData, setRepoData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchRepoData = async () => {
			const databases = new Databases(client);
			const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID as string;
			const collectionId = process.env.NEXT_PUBLIC_REPO_COLLECTION_ID as string;

			try {
				const document = await databases.getDocument(
					databaseId,
					collectionId,
					repoId,
				);
				setRepoData(document);
			} catch (error) {
				console.error("Error fetching repo data:", error);
				router.push("/dashboard");
			} finally {
				setLoading(false);
			}
		};

		fetchRepoData().catch(console.error);
	}, [repoId, router]);

	if (loading) return <div>Loading...</div>;

	return (
		<div>
			<h1>Repository: {repoData?.name}</h1>
			<FileUpload
				repoId={repoId}
				userId={repoData?.userId}
				repoName={repoData?.name}
			/>
		</div>
	);
};

export default RepoPage;
