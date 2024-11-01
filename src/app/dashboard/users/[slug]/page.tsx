import { Badge } from "@/components/ui/badge";
import { db } from "@/server/db";
import Avatar from "boring-avatars";
import { EthernetPort } from "lucide-react";
import { notFound } from "next/navigation";
import { AddRevieweeButton } from "./_components/add-reviewee-button";
import { AddReviewerButton } from "./_components/add-reviewer-button";
import { RemoveRevieweeButton } from "./_components/remove-reviewee-button";
import { RemoveReviewerButton } from "./_components/remove-reviewer-button";
import { UserInfoHead } from "./_components/user-info-head";

type PageProps = {
	params: Promise<{
		slug: string;
	}>;
};

const Page = async (props: PageProps) => {
	const params = await props.params;
	const user = await db.user.findUnique({
		where: { slug: params.slug },
	});

	if (!user) {
		return notFound();
	}

	const reviewers = await db.review
		.findMany({
			where: { revieweeId: user.id, reviewer: { isArchived: false } },
			orderBy: { reviewer: { slug: "asc" } },
			select: { reviewer: true },
		})
		.then((_) => _.map((_) => _.reviewer)); // ネストを一段階外す

	const reviewees = await db.review
		.findMany({
			where: { reviewerId: user.id, reviewee: { isArchived: false } },
			orderBy: { reviewee: { slug: "asc" } },
			select: { reviewee: true },
		})
		.then((_) => _.map((_) => _.reviewee));

	const users = await db.user.findMany({
		where: { isArchived: false, id: { not: user.id } },
		orderBy: { slug: "asc" },
	});

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
				<div className="grow">{/* spacer */}</div>
				<span className="flex">
					<EthernetPort />
					<span className="ml-2 font-mono">{user.ip}</span>
				</span>
			</div>
			{user.isArchived && (
				<div className="p-4 bg-destructive text-destructive-foreground border-b">
					このユーザーはアーカイブされています。情報の編集はできません。
				</div>
			)}
			<div className="p-4">
				<div className="grid gap-4">
					<h3 className="text-lg font-semibold">権限</h3>
					<div className="flex gap-2">
						{user.canAccessTimecard && <Badge>タイムカード</Badge>}
						{user.canAccessUserManagement && <Badge>ユーザー管理</Badge>}
					</div>
				</div>
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
						<div className="flex gap-2">
							{reviewers.map((reviewer) => {
								return (
									<div
										key={reviewer.id}
										className="p-2 bg-background rounded-xl border relative group"
									>
										<UserInfoHead user={reviewer} />
										<RemoveReviewerButton
											selfId={user.id}
											reviewerId={reviewer.id}
										/>
									</div>
								);
							})}
							<AddReviewerButton
								selfId={user.id}
								users={users}
								currentReviewerIds={reviewers.map((_) => _.id)}
							/>
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
						<div className="flex gap-2">
							{reviewees.map((reviewee) => {
								return (
									<div
										key={reviewee.id}
										className="p-2 bg-background rounded-xl border relative group"
									>
										<UserInfoHead user={reviewee} />
										<RemoveRevieweeButton
											selfId={user.id}
											revieweeId={reviewee.id}
										/>
									</div>
								);
							})}
							<AddRevieweeButton
								selfId={user.id}
								users={users}
								currentRevieweeIds={reviewees.map((_) => _.id)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
