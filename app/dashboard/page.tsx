"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "../appwrite";
import { siteConfig } from "@/config/site";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

interface User {
	name: string;
}

interface Repository {
	id: string;
	name: string;
}

const Dashboard = () => {
	const [user, setUser] = useState<User | null>(null);
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const router = useRouter();

	useEffect(() => {
		const checkAuthentication = async () => {
			try {
				const session = await account.getSession("current");
				if (!session) {
					router.push(siteConfig.routes.login);
				} else {
					const userData = await account.get();
					setUser(userData as User);
					// Fetch repositories or other user-related data here
					// setRepositories(fetchedRepositories);
				}
			} catch (error) {
				console.error("Failed to fetch user data:", error);
				router.push(siteConfig.routes.login);
			}
		};

		checkAuthentication();
	}, [router]);

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen text-white">
			<section className="flex flex-col items-center justify-center gap-6 py-12 md:py-16">
				<div className="text-center max-w-2xl">
					<h1 className="text-3xl font-bold mb-4">
						Welcome to Versionary, {user.name}!
					</h1>
				</div>
				<div className="flex flex-col gap-4 w-full max-w-4xl">
					<Card className="shadow-lg transition-transform transform rounded-lg w-full">
						<CardHeader className="font-bold text-lg bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 text-white p-4 rounded-t-lg">
							Your Repositories
						</CardHeader>
						<CardBody className="p-4">
							{repositories.length > 0 ? (
								<ul>
									{repositories.map((repo) => (
										<li key={repo.id} className="border-b border-gray-700 py-2">
											{repo.name}
										</li>
									))}
								</ul>
							) : (
								<p>You have no repositories yet.</p>
							)}
						</CardBody>
					</Card>
				</div>
			</section>
		</div>
	);
};

export default Dashboard;
