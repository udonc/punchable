import { db } from "@/server/db";
import Avatar from "boring-avatars";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { UserInfoHead } from "./_components/user-info-head";

type PageProps = {
	params: {
		slug: string;
	};
};

const Page: NextPage<PageProps> = async (props) => {
	const user = await db.user.findUnique({
		where: { slug: props.params.slug },
	});

	if (!user) {
		return notFound();
	}

	const reviewers = await db.review
		.findMany({
			where: { revieweeId: user.id, reviewer: { isArchived: false } },
			select: { reviewer: true },
		})
		.then((_) => _.map((_) => _.reviewer)); // ネストを一段階外す

	const reviewees = await db.review
		.findMany({
			where: { reviewerId: user.id, reviewee: { isArchived: false } },
			select: { reviewee: true },
		})
		.then((_) => _.map((_) => _.reviewee));

	return (
		<div>
			<div className="flex p-4 gap-4 items-center border-b">
				<Avatar
					size={48}
					name={user.slug}
					variant="beam"
					data-archived={user.isArchived}
					className="data-[archived=true]:opacity-50 data-[archived=true]:grayscale"
				/>
				<h2 className="text-xl font-bold">{user.name}</h2>
				<span className="text-muted-foreground font-mono">{user.slug}</span>
			</div>
			<div className="p-4">
				<div className="grid gap-4">
					<h3 className="text-lg font-semibold">
						{user.name}の日報を確認できる人
					</h3>
					<div className="grid gap-1">
						<span className="text-xs text-muted-foreground">
							{reviewers.length} 人
						</span>
						<div className="flex">
							{reviewers.map((reviewer) => {
								return (
									<div
										key={reviewer.id}
										className="p-2 bg-background rounded-xl border"
									>
										<UserInfoHead user={reviewer} />
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
			<div className="p-4">
				<div className="grid gap-4">
					<h3 className="text-lg font-semibold">
						{user.name}が日報を閲覧できる人
					</h3>
					<div className="grid gap-1">
						<span className="text-xs text-muted-foreground">
							{reviewees.length} 人
						</span>
						<div className="flex">
							{reviewees.map((reviewee) => {
								return (
									<div
										key={reviewee.id}
										className="p-2 bg-background rounded-xl border"
									>
										<UserInfoHead user={reviewee} />
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
