"use client";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

import { account } from "../appwrite";

import { siteConfig } from "@/config/site";

const initialValues: {
	email: string;
	password: string;
	confirmPassword: string;
} = {
	email: "",
	password: "",
	confirmPassword: "",
};

const SignupSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Required"),
	password: Yup.string().required("Required"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("password"), undefined], "Passwords must match")
		.required("Required"),
});

const SignupPage = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const signup = async (email: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			await account.create("unique()", email, password);
			await account.createEmailPasswordSession(email, password);
		} catch (err) {
			setError("Signup failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (
		values: { email: string; password: string; confirmPassword: string },
		{
			setSubmitting,
		}: FormikHelpers<{
			email: string;
			password: string;
			confirmPassword: string;
		}>,
	) => {
		await signup(values.email, values.password);
		setSubmitting(false);
	};

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-center text-[25px] font-bold mb-6">Sign Up</h1>

			<Formik
				initialValues={initialValues}
				validationSchema={SignupSchema}
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
