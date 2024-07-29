import { z } from "zod";

export const CreateUserInput = z.object({
	name: z.string().min(1),
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/, "半角英数字とハイフンのみで入力する必要があります"),
	ip: z.string().min(1).ip("有効なIPアドレスを入力してください"),
});
