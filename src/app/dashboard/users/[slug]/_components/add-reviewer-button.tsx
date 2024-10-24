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
import { addReviewers } from "../../_actions/user";
import { AddReviewerInput } from "../../schema";
import { UserMultiSelector } from "./user-multi-selector";

type AddReviewerButtonProps = {
	selfId: string;
	users: {
		id: string;
		name: string;
		slug: string;
	}[];
	currentReviewerIds?: string[];
};

export const AddReviewerButton = ({
	selfId,
	users,
	currentReviewerIds,
}: AddReviewerButtonProps) => {
	const form = useForm<z.infer<typeof AddReviewerInput>>({
		resolver: zodResolver(AddReviewerInput),
		mode: "onSubmit",
		defaultValues: {
			reviewerIds: [],
		},
	});

	const selectedUserIds = useWatch({
		control: form.control,
		name: "reviewerIds",
	});

	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);

	const onSubmit = async (data: z.infer<typeof AddReviewerInput>) => {
		startTransition(async () => {
			const result = await addReviewers(selfId, data.reviewerIds);

			if (result._type === "failure") {
				toast.error(result.error);
				return;
			}

			toast.success("日報管理者を追加しました");
			form.reset();
			setIsOpen(false);
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="rounded-xl border h-full min-h-16 border-dashed text-muted-foreground flex gap-1 items-center"
				>
					<PlusCircle />
					追加する
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>日報を確認できる人を追加</DialogTitle>
				<DialogDescription>
					日報を確認できる人を追加することで、その人は日報を確認できるようになります。
				</DialogDescription>
				<div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="grid gap-4">
								<div>{selectedUserIds.length} 人が選択されています</div>
								<UserMultiSelector
									users={users}
									currentSelectedUserIds={currentReviewerIds || []}
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
