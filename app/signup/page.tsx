"use client";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";

import { account, ID } from "../appwrite";
import { Models } from "appwrite";

import { siteConfig } from "@/config/site";

interface FormValues {
    email: string;
    password: string;
    confirmPassword?: string;
    name?: string;
}

const initialValues: FormValues = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
};

const SignupSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Passwords must match")
        .required("Required"),
    name: Yup.string().required("Required"),
});

const SignupPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [isSignup, setIsSignup] = useState(true);
    const router = useRouter();

    const signup = async (email: string, password: string, name: string) => {
        setLoading(true);
        setError(null);
        try {
            await account.create(ID.unique(), email, password, name);
            await login(email, password);
        } catch (err) {
            setError("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            await account.createEmailPasswordSession(email, password);
            const user = await account.get();
            setLoggedInUser(user);
            router.push(siteConfig.routes.dashboard);
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await account.deleteSession("current");
        setLoggedInUser(null);
    };

    const handleSubmit = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        if (isSignup && values.name && values.confirmPassword) {
            await signup(values.email, values.password, values.name);
        } else {
            await login(values.email, values.password);
        }
        setSubmitting(false);
    };

    if (loggedInUser) {
        return (
            <div>
                <p>Logged in as {loggedInUser.name}</p>
                <button type="button" onClick={logout}>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-center text-[25px] font-bold mb-6">{isSignup ? "Sign Up" : "Login"}</h1>

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
                        {isSignup && (
                            <>
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
                                    errorMessage={errors.confirmPassword}
                                    isInvalid={!!errors.confirmPassword && touched.confirmPassword}
                                    label="Confirm Password"
                                    type="password"
                                    value={values.confirmPassword}
                                    variant="bordered"
                                    onChange={handleChange("confirmPassword")}
                                />
                            </>
                        )}
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <Button
                            color="primary"
                            isLoading={loading}
                            type="submit"
                            variant="flat"
                        >
                            {isSignup ? "Sign Up" : "Login"}
                        </Button>
                    </form>
                )}
            </Formik>

            <div className="font-light text-slate-400 mt-4 text-sm">
                {isSignup ? (
                    <>
                        Already have an account?{" "}
                        <Link className="font-bold" href="#" onClick={() => setIsSignup(false)}>
                            Login here
                        </Link>
                    </>
                ) : (
                    <>
                        Don&apos;t have an account?{" "}
                        <Link className="font-bold" href="#" onClick={() => setIsSignup(true)}>
                            Register here
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default SignupPage;