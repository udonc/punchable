"use server";

import { failure, success, type ActionResult } from "@/lib/actions";
import { db } from "@/server/db";
import { getIp } from "@/util/ip";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { z } from "zod";
import type { CreateUserInput } from "../schema";

export const testAction = (value: string) => {
	console.log(value);
	return true;
};

export const checkDuplicateSlug = async (
	slug: string,
): Promise<ActionResult<{ duplicated: boolean }>> => {
	try {
		const user = await db.user.findUnique({ where: { slug } });
		return success({ duplicated: !!user });
	} catch (e) {
		return failure("エラーが発生しました");
	}
};

export const checkDuplicateIp = async (
	ip: string,
): Promise<ActionResult<{ duplicated: boolean }>> => {
	try {
		const found = await db.user.findUnique({ where: { ip: ip } });
		return success({ duplicated: !!found });
	} catch (e) {
		return failure("エラーが発生しました");
	}
};

/** ユーザーの新規作成 */
export const createUser = async (data: z.infer<typeof CreateUserInput>) => {
	const ip = getIp(headers()) || "";

	try {
		const created = await db.user.create({
			data: {
				name: data.name,
				slug: data.slug,
				ip: data.ip,
			},
		});
		return success(created);
	} catch (error) {
		return failure("エラーが発生しました");
	} finally {
		revalidatePath("/dashboard/users");
	}
};

/** ユーザーの更新 */
export const updateUser = async (
	id: string,
	data: z.infer<typeof CreateUserInput>,
) => {
	try {
		const updated = await db.user.update({
			where: { id },
			data: {
				name: data.name,
				slug: data.slug,
				ip: data.ip,
			},
		});
		return success(updated);
	} catch (error) {
		return failure("エラーが発生しました");
	} finally {
		revalidatePath("/dashboard/users");
	}
};

/** ユーザーの削除 */
export const deleteUser = async (id: string) => {
	try {
		await db.user.delete({ where: { id } });
		return success(null);
	} catch (error) {
		return failure("エラーが発生しました");
	} finally {
		revalidatePath("/dashboard/users");
	}
};

/** ユーザーのアーカイブ */
export const archiveUser = async (id: string) => {
	try {
		const updated = await db.user.update({
			where: { id },
			data: { isArchived: true },
		});
		return success(updated);
	} catch (error) {
		return failure("エラーが発生しました");
	} finally {
		revalidatePath("/dashboard/users");
	}
};

/** ユーザーのアーカイブ解除 */
export const unarchiveUser = async (id: string) => {
	try {
		const updated = await db.user.update({
			where: { id },
			data: { isArchived: false },
		});
		return success(updated);
	} catch (error) {
		return failure("エラーが発生しました");
	} finally {
		revalidatePath("/dashboard/users");
	}
};

/** ユーザーにレビュアーを追加 */
export const addReviewer = async (revieweeId: string, reviewerId: string) => {
	try {
		const updated = await db.review.create({
			data: {
				revieweeId,
				reviewerId,
			},
		});
		return success(updated);
	} catch (error) {
		return failure("エラーが発生しました");
	} finally {
		revalidatePath("/dashboard/users");
	}
};

/** ユーザーのレビュアーを削除 */
export const removeReviewer = async (
	revieweeId: string,
	reviewerId: string,
) => {
	try {
		await db.review.delete({
			where: {
				reviewerId_revieweeId: {
					revieweeId,
					reviewerId,
				},
			},
		});
		return success(null);
	} catch (error) {
		return failure("エラーが発生しました");
	} finally {
		revalidatePath("/dashboard/users");
	}
};

/** ユーザーにレビュイーを追加 */
export const addReviewee = async (reviewerId: string, revieweeId: string) => {
	try {
		const updated = await db.review.create({
			data: {
				reviewerId,
				revieweeId,
			},
		});
		return success(updated);
	} catch (error) {
		return failure("エラーが発生しました");
	} finally {
		revalidatePath("/dashboard/users");
	}
};

/** ユーザーのレビュイーを削除 */
export const removeReviewee = async (
	reviewerId: string,
	revieweeId: string,
) => {
	try {
		await db.review.delete({
			where: {
				reviewerId_revieweeId: {
					revieweeId,
					reviewerId,
				},
			},
		});
		return success(null);
	} catch (error) {
		return failure("エラーが発生しました");
	} finally {
		revalidatePath("/dashboard/users");
	}
};
