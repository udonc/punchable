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
