import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/app/appwrite";
import { siteConfig } from "@/config/site";

export const useAuthCheck = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const checkAuthentication = async () => {
			setLoading(true);
			try {
				const session = await account.getSession("current");
				if (session) {
					router.push(siteConfig.routes.dashboard);
				}
			} catch (error) {
				setError("No active session");
			} finally {
				setLoading(false);
			}
		};

		checkAuthentication();
	}, [router]);

	return { loading, error };
};
