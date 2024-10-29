"use client";

import { ColumnDef } from "@tanstack/react-table";
import Avatar from "boring-avatars";
import { ActionDropDownMenu } from "./_components/action-dropdown-menu";
import { NameCell } from "./_components/user-table-cell";

export type User = {
	id: string;
	name: string;
	slug: string;
	ip: string;
	isArchived: boolean;
	canAccessTimecard: boolean;
	canAccessUserManagement: boolean;
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
			return <NameCell user={row.original} />;
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
