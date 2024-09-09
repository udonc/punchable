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
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import { User } from "../columns";
import { UserEditDialog } from "./user-edit-dialog";

export const ActionDropDownMenu = ({ row }: { row: Row<User> }) => {
	const user = row.original;

	const [isOpen, setIsOpen] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);

	const UserEditDialogRef = useRef<{ openDialog: () => void }>(null);

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
					<DropdownMenuItem
						onClick={() => UserEditDialogRef.current?.openDialog()}
					>
						編集
					</DropdownMenuItem>
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
							ユーザー &quot;{user.name}&quot; を削除しますか？
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
			<UserEditDialog
				ref={UserEditDialogRef}
				id={user.id}
				oldUser={{ name: user.name, slug: user.slug, ip: user.ip }}
			/>
		</div>
	);
};
