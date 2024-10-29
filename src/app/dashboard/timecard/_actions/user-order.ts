"use server";

import { ActionResult, success } from "@/lib/actions";
import { db } from "@/server/db";

export const setUserOrder = async (
	userIds: string[],
): Promise<ActionResult<null>> => {
	const queries = userIds.map((userId, index) => {
		return db.userOrder.upsert({
			where: { userId_key: { userId, key: "timecard" } },
			create: { userId, key: "timecard", order: index },
			update: { order: index },
		});
	});

	const _results = await db.$transaction(queries);

	return success(null);
};
