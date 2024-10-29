"use client";

import { Button } from "@/components/ui/button";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
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

	return (
		<div>
			<div>
				<Button onClick={() => setIsEditMode((_) => !_)}>編集</Button>
			</div>

			<DndContext
				onDragEnd={(e) => {
					if (e.active.id === e.over?.id) return;
					const oldIndex = users.findIndex((_) => _.id === e.active.id);
					const newIndex = users.findIndex((_) => _.id === e.over?.id);
					const newUsers = arrayMove(users, oldIndex, newIndex);
					setUsers(newUsers);
				}}
			>
				<SortableContext items={users}>
					<div className="grid grid-cols-6">
						{users.map((user) => (
							<UserTableItem key={user.id} {...user} />
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
};
