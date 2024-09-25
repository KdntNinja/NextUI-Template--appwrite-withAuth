"use client";

import React, { useEffect, useCallback, useReducer } from "react";
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
import dynamic from "next/dynamic";
import Link from "next/link";

const FileUpload = dynamic(() => import("./repo/[repoId]/FileUpload"), {
	ssr: false,
});

interface State {
	user: any | null;
	repositories: any[];
	loading: boolean;
	error: string | null;
}

interface Action {
	type: string;
	payload?: any;
}

const initialState: State = {
	user: null,
	repositories: [],
	loading: true,
	error: null,
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "SET_USER":
			return { ...state, user: action.payload, loading: false };
		case "SET_REPOSITORIES":
			return { ...state, repositories: action.payload };
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload, loading: false };
		default:
			return state;
	}
};

const Dashboard: React.FC = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { user, repositories, loading, error } = state;
	const router = useRouter();

	const fetchUser = useCallback(async () => {
		dispatch({ type: "SET_LOADING", payload: true });
		try {
			const userData = await account.get();
			dispatch({ type: "SET_USER", payload: userData });
			await fetchRepositories(userData.$id);
		} catch (error) {
			console.error("Error fetching user data:", error);
			dispatch({
				type: "SET_ERROR",
				payload: "Failed to fetch user data. Redirecting to login.",
			});
			setTimeout(() => {
				router.push(siteConfig.routes.login);
			}, 2000);
		}
	}, [router]);

	const fetchRepositories = useCallback(async (userId: string) => {
		const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID as string;
		const collectionId = process.env.NEXT_PUBLIC_REPO_COLLECTION_ID as string;

		try {
			const response = await databases.listDocuments(databaseId, collectionId, [
				Query.equal("ownerId", userId),
			]);
			dispatch({ type: "SET_REPOSITORIES", payload: response.documents });
		} catch (error) {
			console.error("Error fetching repositories:", error);
			dispatch({ type: "SET_ERROR", payload: "Failed to fetch repositories." });
		}
	}, []);

	const deleteRepository = useCallback(
		async (repoId: string) => {
			const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID as string;
			const collectionId = process.env.NEXT_PUBLIC_REPO_COLLECTION_ID as string;
			const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string;

			try {
				const storage = new Storage(client);
				const filesResponse = await storage.listFiles(bucketId, [
					Query.equal("repoId", repoId),
				]);

				for (const file of filesResponse.files) {
					await storage.deleteFile(bucketId, file.$id);
				}

				await databases.deleteDocument(databaseId, collectionId, repoId);

				dispatch({
					type: "SET_REPOSITORIES",
					payload: repositories.filter((repo: any) => repo.$id !== repoId),
				});

				router.push(`${siteConfig.routes.dashboard}/delete-repo`);
			} catch (error) {
				console.error("Error deleting repository:", error);
				dispatch({
					type: "SET_ERROR",
					payload: "Failed to delete repository.",
				});
			}
		},
		[repositories, router],
	);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

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
								{repositories.map((repo: any) => (
									<li key={repo.$id} className="repo-item">
										<Link href={`${siteConfig.routes.repo}/${repo.$id}`}>
											<span className="repo-link">{repo.name}</span>
										</Link>
										<Button
											color="danger"
											onClick={() => deleteRepository(repo.$id)}
										>
											Delete
										</Button>
										<Button
											color="primary"
											onClick={() =>
												router.push(`${siteConfig.routes.repo}/${repo.$id}`)
											}
										>
											Go to page
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
