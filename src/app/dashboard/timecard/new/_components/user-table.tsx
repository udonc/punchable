"use client";

import { CreateTimecardInput } from "@/app/dashboard/users/schema";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DndContext, DragOverlay, UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { setUserOrder } from "../../_actions/user-order";
import { TimecardTypeRadio } from "./timecard-type-radio";
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
		mode: "onChange",
	});

	const onSubmit = async (data: z.infer<typeof CreateTimecardInput>) => {
		console.log("submit");
		console.log(data);
		form.reset();
	};

	const activeUser = users.find((_) => _.id === activeItem);

	return (
		<div>
			<Form {...form}>
				<form
					className="flex flex-col gap-8"
					onSubmit={form.handleSubmit(onSubmit)}
				>
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
							<FormField
								name="userId"
								control={form.control}
								render={({ field }) => {
									return (
										<FormItem>
											<FormDescription>ユーザー</FormDescription>
											<FormControl>
												<div className="grid grid-cols-6 gap-2 rounded-md ring-offset-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-ring">
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
						</SortableContext>
						<DragOverlay>
							{activeItem && activeUser && (
								<UserTableItemDragOverlay {...activeUser} />
							)}
						</DragOverlay>
					</DndContext>
					<FormField
						name="type"
						control={form.control}
						render={({ field }) => {
							return (
								<FormItem>
									<FormDescription>出欠ステータス</FormDescription>
									<FormControl>
										<div className="grid grid-cols-3 overflow-hidden rounded-md border ring-offset-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-ring">
											<TimecardTypeRadio
												{...field}
												value="attend"
												className="has-[:checked]:bg-green-500 has-[:checked]:text-white border-r"
											>
												出勤
											</TimecardTypeRadio>
											<TimecardTypeRadio
												{...field}
												value="absent"
												className="has-[:checked]:bg-red-500 has-[:checked]:text-white border-r"
											>
												欠勤
											</TimecardTypeRadio>
											<TimecardTypeRadio
												{...field}
												value="other"
												className="has-[:checked]:bg-yellow-500 has-[:checked]:text-white"
											>
												その他
											</TimecardTypeRadio>
										</div>
									</FormControl>
									<FormMessage></FormMessage>
								</FormItem>
							);
						}}
					/>
					<FormField
						name="note"
						control={form.control}
						render={({ field }) => {
							return (
								<FormItem>
									<FormDescription>備考</FormDescription>
									<FormControl>
										<Input
											{...field}
											className="w-full p-2 border rounded-md"
											placeholder="備考を入力..."
										/>
									</FormControl>
									<FormMessage></FormMessage>
								</FormItem>
							);
						}}
					/>
					<Button type="submit" disabled={!form.formState.isValid}>
						打刻する
					</Button>
				</form>
			</Form>
		</div>
	);
};
