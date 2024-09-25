"use client";
import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarBrand,
	NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";
import { account } from "@/app/appwrite";

export const Navbar = () => {
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
					<NextLink
						className="flex justify-start items-center gap-1"
						href={isAuthenticated ? siteConfig.routes.dashboard : "/"}
					>
						<Logo />
						<p className="font-bold text-inherit">{siteConfig.name}</p>
					</NextLink>
				</NavbarBrand>
				<ul className="hidden lg:flex gap-4 justify-start ml-2">
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href} className="p-2">
							<Button as={NextLink} href={item.href}>
								{item.label}
							</Button>
						</NavbarItem>
					))}
				</ul>
			</NavbarContent>
		</NextUINavbar>
	);
};
