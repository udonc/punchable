"use client";

import { SelfInfoContext } from "@/components/self-info-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useContext } from "react";

type NameCellProps = {
	user: {
		id: string;
		name: string;
		slug: string;
	};
};

export const NameCell = ({ user }: NameCellProps) => {
	const self = useContext(SelfInfoContext);
	return (
		<div className="flex gap-1 items-center">
			<Button variant="link" className="text-left" asChild>
				<Link href={`/dashboard/users/${user.slug}`}>{user.name}</Link>
			</Button>
			{self?.slug === user.slug && (
				<Badge className="hover:bg-foreground">自分</Badge>
			)}
		</div>
	);
};
