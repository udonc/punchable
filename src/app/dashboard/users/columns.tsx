"use client";

import { SelfInfoContext } from "@/components/self-info-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Avatar from "boring-avatars";
import Link from "next/link";
import { useContext } from "react";
import { ActionDropDownMenu } from "./_components/action-dropdown-menu";

export type User = {
	id: string;
	name: string;
	slug: string;
	ip: string;
	isArchived: boolean;
};

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "slug",
		header: "",
		cell: ({ row }) => {
			return (
				<div aria-label="ユーザーのアバター">
					<Avatar
						size={32}
						name={row.original.slug}
						variant="beam"
						data-archived={row.original.isArchived}
						className="data-[archived=true]:opacity-50 data-[archived=true]:grayscale "
					/>
				</div>
			);
		},
	},
	{
		accessorKey: "name",
		header: "名前",
		cell: ({ row }) => {
			const self = useContext(SelfInfoContext);
			return (
				<div className="flex gap-1 items-center">
					<Button variant="link" className="text-left" asChild>
						<Link href={`/dashboard/users/${row.original.slug}`}>
							{row.original.name}
						</Link>
					</Button>
					{self?.slug === row.original.slug && (
						<Badge className="hover:bg-foreground">自分</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "slug",
		header: "スラッグ",
		cell: ({ row }) => (
			<div className="flex items-center">
				<code className="font-mono bg-primary-foreground border border-border/50 px-1 rounded">
					{row.original.slug}
				</code>
			</div>
		),
	},
	{
		accessorKey: "ip",
		header: "IPアドレス",
		cell: ({ row }) => (
			<div className="flex items-center">
				<code className="font-mono bg-primary-foreground border border-border/50 px-1 rounded">
					{row.original.ip}
				</code>
			</div>
		),
	},
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => (
			<div className="flex items-center">
				<code className="font-mono bg-primary-foreground border border-border/50 px-1 rounded">
					{row.original.id}
				</code>
			</div>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => <ActionDropDownMenu row={row} />,
	},
];
