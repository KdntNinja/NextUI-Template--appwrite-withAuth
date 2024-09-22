import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-xl text-center justify-center">
				<span className={title()}>The new&nbsp;</span>
				<span className={title({ color: "violet" })}>Git project&nbsp;</span>
				<br />
				<span className={title()}>management site.</span>
				<div className={subtitle({ class: "mt-4" })}>
					Beautiful, fast and modern.
				</div>
			</div>

			<div className="flex gap-3">
				<Link
					isExternal
					className={buttonStyles({
						color: "primary",
						radius: "full",
						variant: "shadow",
					})}
					href={siteConfig.page.signup}
				>
					Get Started
				</Link>
				<Link
					isExternal
					className={buttonStyles({ variant: "bordered", radius: "full" })}
					href={siteConfig.page.continueWithGithub}
				>
					<GithubIcon size={20} />
					Continue with GitHub
				</Link>
			</div>
		</section>
	);
}
