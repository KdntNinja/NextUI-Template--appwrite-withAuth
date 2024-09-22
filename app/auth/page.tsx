"use client";
import { useState } from "react";

import { account, ID } from "../appwrite";

interface User {
	name: string;
	email: string;
	password: string;
}

const LoginPage = () => {
	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (email: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			const session = await account.createEmailPasswordSession(email, password);

			// @ts-ignore
			setLoggedInUser(await account.get());
		} catch (err) {
			setError("Login failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	const register = async () => {
		setLoading(true);
		setError(null);
		try {
			await account.create(ID.unique(), email, password, name);
			await login(email, password);
		} catch (err) {
			setError("Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		try {
			await account.deleteSession("current");
			setLoggedInUser(null);
		} finally {
			setLoading(false);
		}
	};

	if (loggedInUser) {
		return (
			<div>
				<p>Logged in as {loggedInUser.name}</p>
				<button disabled={loading} type="button" onClick={logout}>
					Logout
				</button>
			</div>
		);
	}

	return (
		<div>
			<p>Not logged in</p>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<form>
				<input
					required
					placeholder="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					required
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<input
					required
					placeholder="Name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button
					disabled={loading}
					type="button"
					onClick={() => login(email, password)}
				>
					{loading ? "Logging in..." : "Login"}
				</button>
				<button disabled={loading} type="button" onClick={register}>
					{loading ? "Registering..." : "Register"}
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
