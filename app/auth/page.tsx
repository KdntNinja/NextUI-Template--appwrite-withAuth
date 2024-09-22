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
				<button type="button" onClick={logout} disabled={loading}>
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
					placeholder="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<input
					placeholder="Name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<button
					type="button"
					onClick={() => login(email, password)}
					disabled={loading}
				>
					{loading ? "Logging in..." : "Login"}
				</button>
				<button type="button" onClick={register} disabled={loading}>
					{loading ? "Registering..." : "Register"}
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
