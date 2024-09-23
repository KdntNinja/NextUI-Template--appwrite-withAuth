"use client";

import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarBrand,
	NavbarItem,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
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
		<NextUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<Logo />
						<p className="font-bold text-inherit">{siteConfig.name}</p>
					</NextLink>
				</NavbarBrand>
				<ul
					className={`hidden lg:flex gap-4 ${isAuthenticated ? "justify-center" : "justify-start"} ml-2`}
				>
					{isAuthenticated ? (
						<>
							<NavbarItem
								onClick={() => router.push(siteConfig.routes.newRepo)}
							>
								<span
									className={clsx(
										linkStyles({ color: "foreground" }),
										"data-[active=true]:text-primary data-[active=true]:font-medium",
									)}
								>
									Create New Repository
								</span>
							</NavbarItem>
							<NavbarItem
								onClick={() => router.push(siteConfig.routes.profile)}
							>
								<span
									className={clsx(
										linkStyles({ color: "foreground" }),
										"data-[active=true]:text-primary data-[active=true]:font-medium",
									)}
								>
									View Profile
								</span>
							</NavbarItem>
							<NavbarItem
								onClick={() => router.push(siteConfig.routes.settings)}
							>
								<span
									className={clsx(
										linkStyles({ color: "foreground" }),
										"data-[active=true]:text-primary data-[active=true]:font-medium",
									)}
								>
									Settings
								</span>
							</NavbarItem>
						</>
					) : (
						siteConfig.navItems.map((item) => (
							<NavbarItem
								key={item.href}
								onClick={() => router.push(item.href)}
							>
								<span
									className={clsx(
										linkStyles({ color: "foreground" }),
										"data-[active=true]:text-primary data-[active=true]:font-medium",
									)}
								>
									{item.label}
								</span>
							</NavbarItem>
						))
					)}
				</ul>
			</NavbarContent>
		</NextUINavbar>
	);
};
