"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Storage } from "appwrite";
import { client } from "@/app/appwrite";

interface FileUploadProps {
	userId: string;
	repoName: string;
	repoId: string; // Add this line
}

const FileUpload: React.FC<FileUploadProps> = ({
	userId,
	repoName,
	repoId,
}) => {
	const [files, setFiles] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(Array.from(e.target.files));
		}
	};

	const handleUpload = async () => {
		if (files.length === 0) {
			setError("Please select files to upload.");
			return;
		}

		setLoading(true);
		setError(null);
		const storage = new Storage(client);

		try {
			const uploadPromises = files.map(async (file) => {
				if (file.size > 5 * 1024 * 1024) {
					throw new Error(
						"Invalid file size. Only files under 5MB are allowed.",
					);
				}

				const uniqueFileId = `${userId}-${repoName}-${Date.now()}`.slice(0, 36);

				await storage.createFile(
					process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
					uniqueFileId,
					file,
				);
			});

			await Promise.all(uploadPromises);
			setFiles([]);
			alert("Files uploaded successfully!");
		} catch (err: any) {
			console.error("Error uploading files:", err);
			setError(err.message || "Failed to upload files. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<input type="file" multiple onChange={handleFileChange} />
			{error && <div className="text-red-500">{error}</div>}
			<Button isLoading={loading} onClick={handleUpload}>
				Upload Files
			</Button>
		</div>
	);
};

export default FileUpload;
