import { env } from "@/env";
import { db } from "@/server/db";

export const getUserStatusById = async (id: string) => {
	const user = await db.user.findUnique({ where: { id } });

	if (!user) {
		return null;
	}

	const { isArchived, canAccessTimecard, canAccessUserManagement } = user;

	return {
		isArchived,
		canAccessTimecard,
		canAccessUserManagement,
	};
};

export const getUserStatusByIp = async (ip: string) => {
	// 管理者のIPアドレスは環境変数から取得
	if (ip === env.ADMIN_IP) {
		return {
			isArchived: false,
			canAccessTimecard: true,
			canAccessUserManagement: true,
		};
	}

	const user = await db.user.findUnique({ where: { ip } });

	if (!user) {
		return null;
	}

	const { isArchived, canAccessTimecard, canAccessUserManagement } = user;

	return {
		isArchived,
		canAccessTimecard,
		canAccessUserManagement,
	};
};
