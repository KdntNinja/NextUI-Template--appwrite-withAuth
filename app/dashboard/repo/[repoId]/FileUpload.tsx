"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Storage } from "appwrite";
import { client } from "@/app/appwrite";

const FileUpload = ({ repoId }: { repoId: string }) => {
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
			for (const file of files) {
				await storage.createFile(
					process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string, // Bucket ID from Appwrite
					file.name,
					file, // The actual file object
				);
			}
			setFiles([]); // Reset files after upload
			alert("Files uploaded successfully!");
		} catch (err) {
			console.error("Error uploading files:", err);
			setError("Failed to upload files. Please try again.");
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
