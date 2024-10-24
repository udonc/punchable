"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addReviewees } from "../../_actions/user";
import { AddRevieweeInput } from "../../schema";
import { UserMultiSelector } from "./user-multi-selector";

type AddRevieweeButtonProps = {
	selfId: string;
	users: {
		id: string;
		name: string;
		slug: string;
	}[];
	currentRevieweeIds?: string[];
};

export const AddRevieweeButton = ({
	selfId,
	users,
	currentRevieweeIds,
}: AddRevieweeButtonProps) => {
	const form = useForm<z.infer<typeof AddRevieweeInput>>({
		resolver: zodResolver(AddRevieweeInput),
		mode: "onSubmit",
		defaultValues: {
			revieweeIds: [],
		},
	});

	const selectedUserIds = useWatch({
		control: form.control,
		name: "revieweeIds",
	});

	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);

	const onSubmit = async (data: z.infer<typeof AddRevieweeInput>) => {
		startTransition(async () => {
			const result = await addReviewees(selfId, data.revieweeIds);

			if (result._type === "failure") {
				toast.error(result.error);
				return;
			}

			toast.success("日報閲覧の権利を付与しました");
			form.reset();
			setIsOpen(false);
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="rounded-xl border h-full min-h-14 border-dashed text-muted-foreground flex gap-1 items-center"
				>
					<PlusCircle />
					追加する
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>日報を閲覧できる人を追加</DialogTitle>
				<DialogDescription>
					日報を閲覧できるユーザーを追加します。選択したユーザーの日報を閲覧できるようになります。
				</DialogDescription>
				<div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="grid gap-4">
								<div>{selectedUserIds.length} 人が選択されています</div>
								<UserMultiSelector
									users={users}
									currentSelectedUserIds={currentRevieweeIds || []}
									name="revieweeIds"
								/>
								<Button type="submit">追加する</Button>
							</div>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};
