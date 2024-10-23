"use server";

import { revalidatePath } from "next/cache";

export const consoleLog = async (message: string) => {
	console.log(message);
	revalidatePath("/dashboard");
};

export const consoleQueryCount = async () => {
	console.count("Query count");
};
