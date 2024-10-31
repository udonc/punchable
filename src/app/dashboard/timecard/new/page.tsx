import { db } from "@/server/db";
import { CreateTimecardForm } from "./_components/create-timecard-form";

const Page = async () => {
	// ユーザー一覧取得
	const users = await db.user.findMany({
		where: {
			isArchived: false,
		},
		orderBy: {
			slug: "asc",
		},
		select: {
			id: true,
			name: true,
			slug: true,
			UserOrder: true,
			Attendance: {
				where: {
					date: {
						gte: new Date(),
					},
				},
			},
		},
	});

	// `UserOrder` をもとにユーザーを並び替え
	const sorted = users.toSorted((a, b) => {
		const orderKey = "timecard";
		const aOrder = a.UserOrder.find((_) => _.key === orderKey)?.order ?? -1;
		const bOrder = b.UserOrder.find((_) => _.key === orderKey)?.order ?? -1;
		return aOrder - bOrder;
	});

	return (
		<div>
			<hgroup className="p-4 border-b grid gap-2">
				<h1 className="text-lg font-semibold">勤怠打刻</h1>
				<p className="text-sm text-muted-foreground">
					タイムカードを新規に打刻します。
				</p>
			</hgroup>
			<main className="p-4">
				<div className="mx-auto max-w-4xl">
					<CreateTimecardForm users={sorted} />
				</div>
			</main>
			<code>
				<pre>{JSON.stringify(users, null, 2)}</pre>
			</code>
		</div>
	);
};

export default Page;
