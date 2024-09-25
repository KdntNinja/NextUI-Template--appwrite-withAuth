"use client";

import React, { useEffect, useState } from "react";
import { account } from "@/app/appwrite"; // Keep your account import
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

const Dashboard = () => {
	const [user, setUser] = useState<any | null>(null); // Use 'any' for flexibility or define a custom type
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await account.get();
				setUser(userData);
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

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>Dashboard</h1>
			{error ? (
				<p className="text-red-500">{error}</p>
			) : user ? (
				<div>
					<p>Welcome, {user?.name || "User"}!</p>
					<Button
						onClick={() => router.push(`${siteConfig.routes.dashboard}/create-repo`)}
					>
						Create Repository
					</Button>
				</div>
			) : (
				<p>User not found.</p>
			)}
		</div>
	);
};

export default Dashboard;
