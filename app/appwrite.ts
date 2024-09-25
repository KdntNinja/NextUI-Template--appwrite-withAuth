import { Client, Account, Storage, Databases } from "appwrite";

export const client = new Client();

client
	.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
	.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);
export { ID } from "appwrite";
export default client;
