"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import Avatar from "boring-avatars";
import { ComponentProps } from "react";

type UserMultiSelectorProps = {
	users: {
		id: string;
		name: string;
		slug: string;
	}[];
	currentSelectedUserIds: string[];
	name: ComponentProps<typeof FormField>["name"];
};

export const UserMultiSelector = ({
	users,
	currentSelectedUserIds,
	name,
}: UserMultiSelectorProps) => {
	return (
		<div className="h-96 border rounded-lg overflow-hidden overflow-y-scroll">
			{users.map((user) => (
				<FormField
					key={user.id}
					name={name}
					render={({ field }) => {
						const isChecked = field.value?.includes(user.id);
						const isDisabled = currentSelectedUserIds?.includes(user.id);
						return (
							<FormItem>
								<FormControl>
									<Label
										data-disabled={currentSelectedUserIds?.includes(user.id)}
										className="flex gap-2 p-4 data-[disabled=false]:hover:bg-foreground/10 data-[disabled=false]:cursor-pointer"
									>
										{isDisabled ? (
											<Checkbox
												checked
												disabled
												className="peer-disabled:opacity-50"
											/>
										) : (
											<Checkbox
												{...field}
												value={user.id}
												checked={isChecked}
												onCheckedChange={(checked) => {
													checked
														? field.onChange([...field.value, user.id])
														: field.onChange(
																field.value?.filter(
																	(id: string) => id !== user.id,
																),
															);
												}}
											/>
										)}
										<Avatar
											size={16}
											variant="beam"
											name={user.slug}
											className="peer-disabled:opacity-50"
										/>
										<span className="peer-disabled:text-muted-foreground">
											{user.name}
										</span>
									</Label>
								</FormControl>
							</FormItem>
						);
					}}
				/>
			))}
		</div>
	);
};
