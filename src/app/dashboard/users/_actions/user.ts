"use server";

import { failure, success, type ActionResult } from "@/lib/actions";
import { db } from "@/server/db";
import { getIp } from "@/util/ip";
import { getUserStatusById, getUserStatusByIp } from "@/util/user";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { z } from "zod";
import type { CreateUserInput } from "../schema";

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
	try {
		// リクエストの認可
		const ip = getIp(await headers()) || "";
		const status = await getUserStatusByIp(ip);
		if (!status) return failure("IPアドレスが不正です");
		if (!status.canAccessUserManagement)
			return failure("ユーザー管理の権限がありません");

		const created = await db.user.create({
			data: {
				name: data.name,
				slug: data.slug,
				ip: data.ip,
				canAccessTimecard: data.canAccessTimecard,
				canAccessUserManagement: data.canAccessUserManagement,
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
		// リクエストの認可
		const ip = getIp(await headers()) || "";
		const status = await getUserStatusByIp(ip);
		if (!status) return failure("IPアドレスが不正です");
		if (!status.canAccessUserManagement)
			return failure("ユーザー管理の権限がありません");

		// ユーザーがアーカイブされている場合は編集できない
		const userStatus = await getUserStatusById(id);
		if (!userStatus) return failure("ユーザーが見つかりません");
		if (userStatus.isArchived)
			return failure("アーカイブされたユーザーは編集できません");

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
		// リクエストの認可
		const ip = getIp(await headers()) || "";
		const status = await getUserStatusByIp(ip);
		if (!status) return failure("IPアドレスが不正です");
		if (!status.canAccessUserManagement)
			return failure("ユーザー管理の権限がありません");

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
		// リクエストの認可
		const ip = getIp(await headers()) || "";
		const status = await getUserStatusByIp(ip);
		if (!status) return failure("IPアドレスが不正です");
		if (!status.canAccessUserManagement)
			return failure("ユーザー管理の権限がありません");

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
		// リクエストの認可
		const ip = getIp(await headers()) || "";
		const status = await getUserStatusByIp(ip);
		if (!status) return failure("IPアドレスが不正です");
		if (!status.canAccessUserManagement)
			return failure("ユーザー管理の権限がありません");

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
	// リクエストの認可
	const ip = getIp(await headers()) || "";
	const status = await getUserStatusByIp(ip);
	if (!status) return failure("IPアドレスが不正です");
	if (!status.canAccessUserManagement)
		return failure("ユーザー管理の権限がありません");

	// ユーザーがアーカイブされている場合は編集できない
	const userStatus = await getUserStatusById(revieweeId);
	if (!userStatus) return failure("ユーザーが見つかりません");
	if (userStatus.isArchived)
		return failure("アーカイブされたユーザーは編集できません");

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

/** ユーザーに複数のレビュアーを追加 */
export const addReviewers = async (
	revieweeId: string,
	reviewerIds: string[],
) => {
	try {
		// リクエストの認可
		const ip = getIp(await headers()) || "";
		const status = await getUserStatusByIp(ip);
		if (!status) return failure("IPアドレスが不正です");
		if (!status.canAccessUserManagement)
			return failure("ユーザー管理の権限がありません");

		// ユーザーがアーカイブされている場合は編集できない
		const userStatus = await getUserStatusById(revieweeId);
		if (!userStatus) return failure("ユーザーが見つかりません");
		if (userStatus.isArchived)
			return failure("アーカイブされたユーザーは編集できません");

		const updated = await db.review.createMany({
			data: reviewerIds.map((reviewerId) => ({
				revieweeId,
				reviewerId,
			})),
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
		// リクエストの認可
		const ip = getIp(await headers()) || "";
		const status = await getUserStatusByIp(ip);
		if (!status) return failure("IPアドレスが不正です");
		if (!status.canAccessUserManagement)
			return failure("ユーザー管理の権限がありません");

		// ユーザーがアーカイブされている場合は編集できない
		const userStatus = await getUserStatusById(revieweeId);
		if (!userStatus) return failure("ユーザーが見つかりません");
		if (userStatus.isArchived)
			return failure("アーカイブされたユーザーは編集できません");

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
		// リクエストの認可
		const ip = getIp(await headers()) || "";
		const status = await getUserStatusByIp(ip);
		if (!status) return failure("IPアドレスが不正です");
		if (!status.canAccessUserManagement)
			return failure("ユーザー管理の権限がありません");

		// ユーザーがアーカイブされている場合は編集できない
		const userStatus = await getUserStatusById(reviewerId);
		if (!userStatus) return failure("ユーザーが見つかりません");
		if (userStatus.isArchived)
			return failure("アーカイブされたユーザーは編集できません");

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

/** ユーザーに複数のレビュイーを追加 */
export const addReviewees = async (
	reviewerId: string,
	revieweeIds: string[],
) => {
	try {
		// リクエストの認可
		const ip = getIp(await headers()) || "";
		const status = await getUserStatusByIp(ip);
		if (!status) return failure("IPアドレスが不正です");
		if (!status.canAccessUserManagement)
			return failure("ユーザー管理の権限がありません");

		// ユーザーがアーカイブされている場合は編集できない
		const userStatus = await getUserStatusById(reviewerId);
		if (!userStatus) return failure("ユーザーが見つかりません");
		if (userStatus.isArchived)
			return failure("アーカイブされたユーザーは編集できません");

		const updated = await db.review.createMany({
			data: revieweeIds.map((revieweeId) => ({
				reviewerId,
				revieweeId,
			})),
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
		// リクエストの認可
		const ip = getIp(await headers()) || "";
		const status = await getUserStatusByIp(ip);
		if (!status) return failure("IPアドレスが不正です");
		if (!status.canAccessUserManagement)
			return failure("ユーザー管理の権限がありません");

		// ユーザーがアーカイブされている場合は編集できない
		const userStatus = await getUserStatusById(reviewerId);
		if (!userStatus) return failure("ユーザーが見つかりません");
		if (userStatus.isArchived)
			return failure("アーカイブされたユーザーは編集できません");

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
