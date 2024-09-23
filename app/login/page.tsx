"use client";
import React, { useRef, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";

import { account } from "../appwrite";
import { siteConfig } from "@/config/site";

const Login = () => {
	const loginForm = useRef<HTMLFormElement>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (loginForm.current) {
			const email = loginForm.current.email.value;
			const password1 = loginForm.current.password1.value;

			try {
				// Check if a session already exists
				const session = await account.getSession("current");
				if (session) {
					console.log("User is already logged in:", session);
					router.push(siteConfig.routes.dashboard);
					return;
				}
			} catch (error) {
				// No active session, proceed to create a new one
			}

			try {
				const response = await account.createSession(email, password1);
				console.log("User has been Logged In:", response);
				router.push(siteConfig.routes.dashboard);
			} catch (error: any) {
				console.error("Login failed:", error);
				setError(
					error.message || "Login failed. Please check your credentials.",
				);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-center text-[25px] font-bold mb-6">Login</h1>
			<form
				ref={loginForm}
				onSubmit={handleLogin}
				className="flex flex-col w-1/2 gap-4 mb-4"
			>
				<Input label="Email" type="email" name="email" variant="bordered" />
				<Input
					label="Password"
					type="password"
					name="password1"
					variant="bordered"
				/>
				{error && <div className="text-red-500 text-sm">{error}</div>}
				<Button
					color="primary"
					isLoading={loading}
					type="submit"
					variant="flat"
				>
					Login
				</Button>
			</form>
			<div className="font-light text-slate-400 mt-4 text-sm">
				Don&apos;t have an account?{" "}
				<Link className="font-bold" href={siteConfig.routes.signup}>
					Register here
				</Link>
			</div>
		</div>
	);
};

export default Login;
