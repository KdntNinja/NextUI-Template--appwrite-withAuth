"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "../appwrite";
import { siteConfig } from "@/config/site";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import Modal from "react-modal";

interface User {
	name: string;
	emailVerification: boolean;
}

interface Repository {
	id: string;
	name: string;
}

const Dashboard = () => {
	const [user, setUser] = useState<User | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
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
					if (!userData.emailVerification) {
						setIsModalOpen(true);
					}
					// Fetch repositories or other user-related data here
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

	if (!user.emailVerification) {
		return (
			<div className="min-h-screen text-white flex flex-col items-center justify-center">
				<h1 className="text-3xl font-bold mb-4">
					Please verify your account to access the dashboard.
				</h1>
			</div>
		);
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
							{/* Repositories display logic can be added here */}
						</CardBody>
					</Card>
				</div>
			</section>

			<Modal
				isOpen={isModalOpen}
				contentLabel="Verify Your Account"
				ariaHideApp={false}
				className="modal"
				overlayClassName="overlay"
			>
				<div className="flex flex-col items-center">
					<h2 className="text-2xl font-bold mb-4">Verify Your Account</h2>
					<p className="mb-4">
						Please verify your email to access the dashboard.
					</p>
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded"
						onClick={() => window.location.reload()}
					>
						Reload
					</button>
				</div>
			</Modal>
		</div>
	);
};

export default Dashboard;
