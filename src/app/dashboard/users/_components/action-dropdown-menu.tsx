import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import { User } from "../columns";
import {
	UserDeleteDialog,
	UserDeleteDialogHandlers,
} from "./user-delete-dialog";
import { UserEditDialog, UserEditDialogHandlers } from "./user-edit-dialog";

export const ActionDropDownMenu = ({ row }: { row: Row<User> }) => {
	const user = row.original;

	const [isOpen, setIsOpen] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);

	const UserEditDialogRef = useRef<UserEditDialogHandlers>(null);
	const UserDeleteDialogRef = useRef<UserDeleteDialogHandlers>(null);

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
						onClick={() => UserDeleteDialogRef.current?.openDialog()}
					>
						削除
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<UserDeleteDialog ref={UserDeleteDialogRef} user={user} />
			<UserEditDialog
				ref={UserEditDialogRef}
				id={user.id}
				oldUser={{ name: user.name, slug: user.slug, ip: user.ip }}
			/>
		</div>
	);
};
