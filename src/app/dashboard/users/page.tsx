import { SelfInfoProvider } from "@/components/self-info-provider";
import { db } from "@/server/db";
import { getIp } from "@/util/ip";
import type { Metadata, NextPage } from "next";
import { headers } from "next/headers";
import { DataTable } from "./_components/user-data-table";
import { columns } from "./columns";

export const metadata: Metadata = {
	title: "ユーザー管理 - Punchable",
};

const Page: NextPage = async () => {
	const ip = getIp(await headers()) || "";
	const self = await db.user.findUnique({ where: { ip } });
	const users = await db.user.findMany({ orderBy: { slug: "asc" } });
	const userCount = users.length;

	return (
		<SelfInfoProvider selfInfo={self}>
			<div className="p-4">
				<hgroup className="grid gap-2">
					<h1 className="text-lg font-bold">ユーザー管理</h1>
					<p className="text-sm text-muted-foreground">
						ユーザーの追加・削除・各種設定の変更などが行えます。
					</p>
				</hgroup>
				<DataTable columns={columns} data={users}></DataTable>
				<div className="py-2">
					<small className="text-muted-foreground">
						ユーザー数: {userCount}
					</small>
				</div>
			</div>
		</SelfInfoProvider>
	);
};

export default Page;
