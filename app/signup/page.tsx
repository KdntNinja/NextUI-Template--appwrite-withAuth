"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { account } from "@/app/appwrite";
import { siteConfig } from "@/config/site";
import { ID } from "appwrite";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const SignupSchema = Yup.object().shape({
	name: Yup.string().required("Required"),
	email: Yup.string().email("Invalid email").required("Required"),
	password: Yup.string().required("Required"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("password")], "Passwords must match")
		.required("Required"),
});

const SignupPage = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useAuthCheck();

	const handleRegistration = async (values: any, { setSubmitting }: any) => {
		setLoading(true);
		setError(null);

		try {
			const response = await account.create(
				ID.unique(),
				values.email,
				values.password,
				values.name,
			);
			console.log("Registration successful:", response);
			await login(values.email, values.password);
			router.push(siteConfig.routes.dashboard);
		} catch (error) {
			console.error("Registration failed:", error);
			setError("Signup failed. Please try again.");
		} finally {
			setLoading(false);
			setSubmitting(false);
		}
	};

	const login = async (email: string, password: string) => {
		await account.createEmailPasswordSession(email, password);
		await account.get();
	};

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-center text-[25px] font-bold mb-6">Sign Up</h1>

			<Formik
				initialValues={{
					name: "",
					email: "",
					password: "",
					confirmPassword: "",
				}}
				validationSchema={SignupSchema}
				onSubmit={handleRegistration}
			>
				{({ values, errors, touched, handleChange, handleSubmit }) => (
					<form
						onSubmit={handleSubmit}
						className="flex flex-col w-1/2 gap-4 mb-4"
					>
						<Input
							errorMessage={errors.name}
							isInvalid={!!errors.name && touched.name}
							label="Name"
							type="text"
							value={values.name}
							variant="bordered"
							onChange={handleChange("name")}
						/>
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
						<Input
							errorMessage={errors.confirmPassword}
							isInvalid={!!errors.confirmPassword && touched.confirmPassword}
							label="Confirm Password"
							type="password"
							value={values.confirmPassword}
							variant="bordered"
							onChange={handleChange("confirmPassword")}
						/>
						{error && <div className="text-red-500 text-sm">{error}</div>}
						<Button
							color="primary"
							isLoading={loading}
							type="submit"
							variant="flat"
						>
							Sign Up
						</Button>
					</form>
				)}
			</Formik>

			<div className="font-light text-slate-400 mt-4 text-sm">
				Already have an account?{" "}
				<Link className="font-bold" href={siteConfig.routes.login}>
					Login here
				</Link>
			</div>
		</div>
	);
};

export default SignupPage;
