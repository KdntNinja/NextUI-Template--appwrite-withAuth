"use client";

import { account, databases, client } from "@/app/appwrite";
import { Button, Card, CardBody, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Query, Storage } from "appwrite";
import Link from "next/link";
import { FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import Typography from "@/components/Typography";
import React, { useReducer, useCallback, useEffect } from "react";
import { Box } from "@mui/material";

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
			setTimeout(() => router.push(siteConfig.routes.login), 2000);
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

				await Promise.all(
					filesResponse.files.map((file) =>
						storage.deleteFile(bucketId, file.$id),
					),
				);

				await databases.deleteDocument(databaseId, collectionId, repoId);
				dispatch({
					type: "SET_REPOSITORIES",
					payload: repositories.filter((repo) => repo.$id !== repoId),
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
					<Typography>Loading user data...</Typography>
				</CardBody>
			</Card>
		);
	}

	return (
		<div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
			<Card>
				<CardBody>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "20px",
						}}
					>
						<Typography h1>Dashboard</Typography>
						<div>
							<Typography h2>Welcome, {user?.name || "User"}!</Typography>
						</div>
						<Button
							onClick={() =>
								router.push(`${siteConfig.routes.dashboard}/create-repo`)
							}
							color="primary"
							size="sm"
						>
							Create Repository
						</Button>
					</div>
					{error ? (
						<p>{error}</p>
					) : user ? (
						<>
							<Typography>Your Repositories</Typography>
							{repositories.length > 0 ? (
								<Box
									display="flex"
									flexWrap="wrap"
									justifyContent="space-between"
								>
									{repositories.map((repo) => (
										<Box
											key={repo.$id}
											width="calc(50% - 10px)"
											marginBottom="15px"
										>
											<Card
												isHoverable
												style={{
													padding: "10px",
													borderRadius: "10px",
													backgroundColor: "#00796b", // Darker color for the card
													color: "#ffffff", // Optional: change text color for contrast
													boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // Optional shadow for depth
												}}
											>
												<CardBody>
													<div
														style={{
															display: "flex",
															justifyContent: "space-between",
															alignItems: "center",
														}}
													>
														<Link
															href={`${siteConfig.routes.repo}/${repo.$id}`}
														>
															<Typography
																style={{
																	fontWeight: "500",
																	textDecoration: "none",
																}}
															>
																{repo.name}
															</Typography>
														</Link>
														<div>
															<Button
																onClick={() => deleteRepository(repo.$id)}
																color="danger"
																size="sm" // Make the button smaller
																style={{ marginRight: "5px" }}
															>
																<FaTrash style={{ marginRight: "5px" }} />
																Delete
															</Button>
															<Button
																onClick={() =>
																	router.push(
																		`${siteConfig.routes.repo}/${repo.$id}`,
																	)
																}
																color="primary"
																size="sm"
															>
																<FaExternalLinkAlt
																	style={{ marginRight: "5px" }}
																/>
																Go to page
															</Button>
														</div>
													</div>
												</CardBody>
											</Card>
										</Box>
									))}
								</Box>
							) : (
								<Typography>No repositories found.</Typography>
							)}
						</>
					) : (
						<Typography>User not found.</Typography>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

export default Dashboard;
