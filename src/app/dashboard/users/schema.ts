import { z } from "zod";

export const CreateUserInput = z.object({
	name: z.string().min(1),
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/, "半角英数字とハイフンのみで入力する必要があります"),
	ip: z.string().min(1).ip("有効なIPアドレスを入力してください"),
	canAccessUserManagement: z.boolean().optional(),
	canAccessTimecard: z.boolean().optional(),
});

export const UpdateUserInput = z.object({
	name: z.string().min(1),
	slug: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/, "半角英数字とハイフンのみで入力する必要があります"),
	ip: z.string().min(1).ip("有効なIPアドレスを入力してください"),
	canAccessUserManagement: z.boolean().optional(),
	canAccessTimecard: z.boolean().optional(),
});

export const ArchiveUserInput = z.object({});

export const UnarchiveUserInput = z.object({});

export const DeleteUserInput = z.object({});

export const AddReviewerInput = z.object({
	reviewerIds: z.array(z.string()),
});

export const AddRevieweeInput = z.object({
	revieweeIds: z.array(z.string()),
});

export const CreateTimecardInput = z.object({
	userId: z.string().cuid2(),
	type: z.enum(["attend", "absent", "other"]),
	note: z.string().trim().optional(),
});
