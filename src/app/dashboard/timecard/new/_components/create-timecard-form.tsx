"use client";

import { CreateTimecardInput } from "@/app/dashboard/users/schema";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { DndContext, DragOverlay, UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { setUserOrder } from "../../_actions/user-order";
import { CreateTimecardUserListItemDragOverlay } from "./create-timecard-form-user-list-item-drag-overlay";
import { CreateTimecardFormUserListItem } from "./create-timecard-user-list-item";
import { TimecardTypeRadio } from "./timecard-type-radio";

type User = {
	id: string;
	name: string;
	slug: string;
};

type CreateTimecardFormProps = {
	users: User[];
};

export const CreateTimecardForm = (props: CreateTimecardFormProps) => {
	const [users, setUsers] = useState(props.users);
	const [activeItem, setActiveItem] = useState<UniqueIdentifier | null>(null);
	const [pending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof CreateTimecardInput>>({
		resolver: zodResolver(CreateTimecardInput),
		mode: "onChange",
		defaultValues: {
			userId: "",
			type: "attend",
			note: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof CreateTimecardInput>) => {
		startTransition(async () => {
			// wait 2000ms
			await new Promise((resolve) => setTimeout(resolve, 2000));
			toast.success("打刻しました");
			console.table(data);
			form.resetField("note");
		});
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
								disabled={pending}
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>ユーザー</FormLabel>
											<FormControl>
												<div
													data-disabled={field.disabled}
													className="data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
												>
													<RadioGroup
														defaultValue={field.value}
														onValueChange={field.onChange}
														onBlur={field.onBlur}
														disabled={field.disabled}
														className="grid grid-cols-6 gap-2 rounded-md ring-offset-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-ring"
													>
														{users.map((user) => (
															<CreateTimecardFormUserListItem
																key={user.id}
																user={user}
																{...field}
																value={user.id}
															>
																{user.name}
															</CreateTimecardFormUserListItem>
														))}
													</RadioGroup>
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
								<CreateTimecardUserListItemDragOverlay
									checked={form.getValues("userId") === activeUser.id}
								>
									{activeUser.name}
								</CreateTimecardUserListItemDragOverlay>
							)}
						</DragOverlay>
					</DndContext>
					<FormField
						name="type"
						control={form.control}
						disabled={pending}
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>出欠ステータス</FormLabel>
									<FormControl>
										<div
											data-disabled={field.disabled}
											className="data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
										>
											<RadioGroup
												defaultValue={field.value}
												onValueChange={field.onChange}
												onBlur={field.onBlur}
												disabled={field.disabled}
												className="grid gap-0 grid-cols-3 overflow-hidden rounded-md border ring-offset-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-ring"
											>
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
											</RadioGroup>
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
						disabled={pending}
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>備考</FormLabel>
									<FormControl>
										<Input placeholder="備考を入力..." {...field} />
									</FormControl>
									<FormMessage></FormMessage>
								</FormItem>
							);
						}}
					/>
					<Button type="submit" disabled={!form.formState.isValid || pending}>
						{pending ? (
							<span className="flex gap-1 items-center">
								送信中
								<LoaderCircle className="h-4 w-4 animate-spin" />
							</span>
						) : (
							<span>打刻する</span>
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
};
