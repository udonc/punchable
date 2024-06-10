import { Button } from "@/components/ui/button";
import { consoleQueryCount } from "@/server/actions";
import { db } from "@/server/db";
import { PlusCircle } from "lucide-react";
import type { Metadata, NextPage } from "next";

export const metadata: Metadata = {
	title: "ユーザー管理 - Punchable",
};

const Page: NextPage = async () => {
	consoleQueryCount();
	const users = await db.user.findMany();
	const userCount = users.length;
	return (
		<div className="p-4">
			<div>
				<Button variant="default">
					<PlusCircle className="mr-2 w-4 h-4" />
					新しいユーザーを追加
				</Button>
			</div>
			<div>{userCount}</div>
		</div>
	);
};

export default Page;
