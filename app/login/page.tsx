"use client";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";

import { account } from "../appwrite";

import { siteConfig } from "@/config/site";

const initialValues: { email: string; password: string } = {
	email: "",
	password: "",
};

const LoginSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Required"),
	password: Yup.string().required("Required"),
});

const LoginPage = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const login = async (email: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			await account.createEmailPasswordSession(email, password);
			await account.get();
			router.push(siteConfig.routes.dashboard);
		} catch (err) {
			setError("Login failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (
		values: { email: string; password: string },
		{ setSubmitting }: FormikHelpers<{ email: string; password: string }>,
	) => {
		await login(values.email, values.password);
		setSubmitting(false);
	};

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-center text-[25px] font-bold mb-6">Login</h1>

			<Formik
				initialValues={initialValues}
				validationSchema={LoginSchema}
				onSubmit={handleSubmit}
			>
				{({ values, errors, touched, handleChange }) => (
					<form className="flex flex-col w-1/2 gap-4 mb-4">
						<Input
							errorMessage={errors.email}
							isInvalid={!!errors.email && touched.email}
							label="Email"
							type="email"
							value={values.email}
							variant="bordered"
							onChange={handleChange("email")}
						/>
						<Input
							errorMessage={errors.password}
							isInvalid={!!errors.password && touched.password}
							label="Password"
							type="password"
							value={values.password}
							variant="bordered"
							onChange={handleChange("password")}
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
				)}
			</Formik>

			<div className="font-light text-slate-400 mt-4 text-sm">
				Don&apos;t have an account?{" "}
				<Link className="font-bold" href={siteConfig.routes.signup}>
					Register here
				</Link>
			</div>
		</div>
	);
};

export default LoginPage;
