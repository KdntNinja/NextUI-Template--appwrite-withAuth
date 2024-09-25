"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { account } from "@/app/appwrite";
import { siteConfig } from "@/config/site";

const initialValues = {
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

	const handleLogin = async (
		values: typeof initialValues,
		{ setSubmitting }: FormikHelpers<typeof initialValues>,
	) => {
		setLoading(true);
		setError(null);

		try {
			const response = await account.createEmailPasswordSession(
				values.email,
				values.password,
			);
			console.log("Login successful:", response);

			router.push(siteConfig.routes.dashboard);
		} catch (error: any) {
			console.error("Login failed:", error);
			setError(error.message || "Login failed. Please check your credentials.");
		} finally {
			setLoading(false);
			setSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-center text-[25px] font-bold mb-6">Login</h1>

			<Formik
				initialValues={initialValues}
				validationSchema={LoginSchema}
				onSubmit={handleLogin}
			>
				{({ values, errors, touched, handleChange, handleSubmit }) => (
					<form
						onSubmit={handleSubmit}
						className="flex flex-col w-1/2 gap-4 mb-4"
					>
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
