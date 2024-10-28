"use client";

import { Button } from "@/components/ui/button";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { UserTableItem } from "./user-table-item";

type UserTableProps = {
	users: {
		id: string;
		name: string;
		slug: string;
	}[];
};

const onDragEnd = (event: DragEndEvent): void => {
	console.log(event);
};

export const UserTable = (props: UserTableProps) => {
	const [isEditMode, setIsEditMode] = useState(false);

	return (
		<div>
			<div>
				<Button onClick={() => setIsEditMode((_) => !_)}>編集</Button>
			</div>

			<DndContext onDragEnd={onDragEnd}>
				<SortableContext items={props.users.map((_) => _.id)}>
					<div className="grid grid-cols-6">
						{props.users.map((user) => (
							<UserTableItem key={user.id} {...user} />
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
};
