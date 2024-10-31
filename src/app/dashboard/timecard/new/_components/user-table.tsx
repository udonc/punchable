"use client";

import { CreateTimecardInput } from "@/app/dashboard/users/schema";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { DndContext, DragOverlay, UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { setUserOrder } from "../../_actions/user-order";
import { UserTableItem } from "./user-table-item";
import { UserTableItemDragOverlay } from "./user-table-item-drag-overlay";

type User = {
	id: string;
	name: string;
	slug: string;
};

type UserTableProps = {
	users: User[];
};

export const UserTable = (props: UserTableProps) => {
	const [users, setUsers] = useState(props.users);
	const [activeItem, setActiveItem] = useState<UniqueIdentifier | null>(null);

	const form = useForm<z.infer<typeof CreateTimecardInput>>({
		resolver: zodResolver(CreateTimecardInput),
		mode: "onSubmit",
	});

	const onSubmit = async (data: z.infer<typeof CreateTimecardInput>) => {
		console.log("submit");
		console.log(data);
	};

	const activeUser = users.find((_) => _.id === activeItem);

	return (
		<div>
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
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								name="userId"
								render={({ field }) => {
									return (
										<FormItem>
											<FormControl>
												<div className="grid grid-cols-6 gap-2">
													{users.map((user) => (
														<UserTableItem
															key={user.id}
															field={field}
															{...user}
														/>
													))}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<div>
								<FormField
									name="type"
									render={({ field }) => {
										return (
											<FormItem>
												<FormControl>
													<select {...form.register("type")}>
														<option value="attend">出勤</option>
														<option value="absent">欠席</option>
													</select>
												</FormControl>
												<FormMessage></FormMessage>
											</FormItem>
										);
									}}
								/>
							</div>
							<Button type="submit">打刻</Button>
						</form>
					</Form>
				</SortableContext>
				<DragOverlay>
					{activeItem && activeUser && (
						<UserTableItemDragOverlay {...activeUser} />
					)}
				</DragOverlay>
			</DndContext>
		</div>
	);
};
