import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
	return (
		<section
			aria-labelledby="homepage-title"
			className="flex flex-col items-center justify-center gap-6 py-12 md:py-16"
		>
			<div className="text-center max-w-2xl">
				<h1 className={`${title()} leading-tight`} id="homepage-title">
					<span>{siteConfig.title_p1}&nbsp;</span>
					<span className={title({ color: "violet" })}>
						{siteConfig.title_p2}&nbsp;
					</span>
					<span>{siteConfig.title_p3}</span>
				</h1>
				<p className={subtitle({ class: "mt-4" })}>{siteConfig.description}</p>
			</div>

			<div className="flex gap-4 mt-6">
				<Link
					isExternal
					aria-label="Get Started"
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
						class: "transition-transform hover:scale-105",
					})}
					href={siteConfig.routes.auth}
				>
					Get Started
				</Link>
				<Link
					isExternal
					aria-label="Continue with GitHub"
					className={buttonStyles({
						variant: "bordered",
						radius: "full",
						class:
							"flex items-center gap-2 transition-transform hover:scale-105",
					})}
					href={siteConfig.routes.continueWithGithub}
				>
					<GithubIcon size={20} />
					<span>Continue with GitHub</span>
				</Link>
			</div>

			<div className="mt-12">
				<h2 className="text-2xl font-bold">Features</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
					{siteConfig.features.map((feature, index) => (
						<Card
							key={index}
							className="shadow-lg transition-transform transform hover:scale-105 hover:rotate-1 hover:shadow-2xl rounded-lg w-full"
						>
							<CardHeader className="font-bold text-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-4 rounded-t-lg">
								{feature.label}
							</CardHeader>
							<CardBody className="p-4">
								<p className="text-gray-600">{feature.description}</p>
							</CardBody>
						</Card>
					))}
				</div>
			</div>

			<footer className="mt-12 py-6 text-center text-gray-600">
				<p>
					&copy; {new Date().getFullYear()} Versionary. All rights reserved.
				</p>
			</footer>
		</section>
	);
}
