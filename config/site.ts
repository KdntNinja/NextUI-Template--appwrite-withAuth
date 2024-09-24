const routes = {
	home: "/",
	about: "/about",
	login: "/login",
	signup: "/signup",
	verify: "/verify",
	dashboard: "/dashboard",
	newRepo: "/new-repo",
	profile: "/profile",
	settings: "/settings",
};

export const siteConfig = {
	name: "Versionary",
	prodDomain: "https://kdnsite.xyz",
	title_p1: "The new",
	title_p2: "Git project",
	title_p3: "management site.",
	description:
		"Beautiful, fast, and modern. Everything you need for managing your projects in one place.",
	routes,
	navItems: [
		{
			label: "Home",
			href: routes.home,
		},
		{
			label: "About",
			href: routes.about,
		},
	],
	features: [
		{
			label: "Blazing Fast Performance",
			description:
				"Experience lightning-fast load times and responsiveness for seamless navigation.",
		},
		{
			label: "Sleek Modern Design",
			description:
				"Enjoy a visually stunning interface that enhances user experience and engagement.",
		},
		{
			label: "Intuitive Project Management",
			description:
				"Easily organize, track, and collaborate on projects with user-friendly tools.",
		},
		{
			label: "Robust Security",
			description:
				"Keep your projects safe with advanced security features and regular backups.",
		},
		{
			label: "Seamless Integration",
			description:
				"Integrate effortlessly with your favorite tools and services for a streamlined workflow.",
		},
		{
			label: "Customizable Workflows",
			description:
				"Tailor your project management experience with flexible and customizable workflows.",
		},
	],
};
