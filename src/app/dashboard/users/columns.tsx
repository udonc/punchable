"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import Avatar from "boring-avatars";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export type User = {
	id: string;
	name: string;
	slug: string;
};

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "slug",
		header: "",
		cell: ({ row }) => {
			return (
				<div aria-label="ユーザーのアバター">
					<Avatar size={32} name={row.original.slug} variant="beam" />
				</div>
			);
		},
	},
	{
		accessorKey: "name",
		header: "名前",
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
		cell: ({ row }) => {
			const user = row.original;

			const [isOpen, setIsOpen] = useState(false);
			const [isDisabled, setIsDisabled] = useState(true);

			return (
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="w-8 h-8 p-0">
								<span className="sr-only">メニューを開く</span>
								<MoreHorizontal className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>ユーザー情報</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>編集</DropdownMenuItem>
							<DropdownMenuItem className="text-destructive">
								アーカイブ
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-destructive"
								onClick={() => setIsOpen(true)}
							>
								削除
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									ユーザー "{user.name}" を削除しますか？
								</AlertDialogTitle>
								<AlertDialogDescription>
									ユーザーとそれに関連するデータがすべて削除されます。
									<br />
									この操作は取り消せません。
								</AlertDialogDescription>
								<AlertDialogDescription>
									削除するには
									<code className="font-mono mx-1 px-1 bg-background border border-border/50 rounded">
										{user.slug}
									</code>
									と入力してください。
								</AlertDialogDescription>
								<Input
									onInput={(e) =>
										setIsDisabled(e.currentTarget.value !== user.slug)
									}
								/>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>キャンセル</AlertDialogCancel>
								<AlertDialogAction
									disabled={isDisabled}
									className={buttonVariants({ variant: "destructive" })}
								>
									削除
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			);
		},
	},
];
