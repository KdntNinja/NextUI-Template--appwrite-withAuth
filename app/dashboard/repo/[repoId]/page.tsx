"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Databases, Storage } from "appwrite";
import { client, account } from "@/app/appwrite";
import FileUpload from "./FileUpload"; // Adjust path if necessary

const RepoPage = ({ params }: { params: { repoId: string } }) => {
	const { repoId } = params;
	const [repoData, setRepoData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [files, setFiles] = useState<any[]>([]); // Adjust type as needed
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

				// Fetch files from the storage bucket
				const storage = new Storage(client);
				const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string;
				const filesList = await storage.listFiles(bucketId); // Adjust based on your storage configuration
				setFiles(filesList.files); // Adjust as necessary based on the response
			} catch (error) {
				console.error("Error fetching repo data:", error);
				router.push("/dashboard");
			} finally {
				setLoading(false);
			}
		};

		fetchRepoData();
	}, [repoId, router]);

	if (loading) return <div>Loading...</div>;

	return (
		<div>
			<h1>Repository: {repoData?.name}</h1>
			<FileUpload repoId={repoId} />
			<h2>Uploaded Files</h2>
			<ul>
				{files.map((file) => (
					<li key={file.$id}>{file.name}</li>
				))}
			</ul>
		</div>
	);
};

export default RepoPage;
