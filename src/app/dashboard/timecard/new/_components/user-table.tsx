"use client";

import { Button } from "@/components/ui/button";
import { DndContext, DragOverlay, UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { toast } from "sonner";
import { setUserOrder } from "../../_actions/user-order";
import { UserTableItem } from "./user-table-item";

type UserTableProps = {
	users: {
		id: string;
		name: string;
		slug: string;
	}[];
};

export const UserTable = (props: UserTableProps) => {
	const [isEditMode, setIsEditMode] = useState(false);
	const [users, setUsers] = useState(props.users);
	const [activeItem, setActiveItem] = useState<UniqueIdentifier | null>(null);

	const activeUser = users.find((_) => _.id === activeItem);

	return (
		<div>
			<div>
				<Button onClick={() => setIsEditMode((_) => !_)}>編集</Button>
			</div>

			<DndContext
				onDragStart={(e) => setActiveItem(e.active.id)}
				onDragEnd={(e) => {
					if (e.active.id === e.over?.id) return;
					const oldIndex = users.findIndex((_) => _.id === e.active.id);
					const newIndex = users.findIndex((_) => _.id === e.over?.id);
					const newUsers = arrayMove(users, oldIndex, newIndex);
					setUsers(newUsers);
					setActiveItem(null);
					setUserOrder(newUsers.map((_) => _.id)).then(() =>
						toast.success("並び替えが完了しました"),
					);
				}}
			>
				<SortableContext items={users}>
					<div className="grid grid-cols-6 gap-2">
						{users.map((user) => (
							<UserTableItem key={user.id} {...user} />
						))}
					</div>
				</SortableContext>
				<DragOverlay>
					{activeItem && activeUser && <UserTableItem {...activeUser} />}
				</DragOverlay>
			</DndContext>
		</div>
	);
};
