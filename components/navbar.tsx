"use client";
import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarBrand,
	NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";
import { account } from "@/app/appwrite";

export const Navbar = () => {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuthentication = async () => {
			try {
				const session = await account.getSession("current");
				setIsAuthenticated(!!session);
			} catch (error) {
				setIsAuthenticated(false);
			}
		};

		checkAuthentication();
	}, []);

	return (
		<NextUINavbar maxWidth="xl" position="sticky" className="p-4">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<Logo />
						<p className="font-bold text-inherit">{siteConfig.name}</p>
					</NextLink>
				</NavbarBrand>
			</NavbarContent>
		</NextUINavbar>
	);
};
