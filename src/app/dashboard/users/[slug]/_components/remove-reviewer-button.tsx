"use client";

import { X } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { removeReviewer } from "../../_actions/user";

type RemoveReviewerButtonProps = {
	selfId: string;
	reviewerId: string;
};

export const RemoveReviewerButton = ({
	selfId,
	reviewerId,
}: RemoveReviewerButtonProps) => {
	const [isPending, startTransition] = useTransition();

	const handleClick = async () => {
		startTransition(async () => {
			const result = await removeReviewer(selfId, reviewerId);
			if (result._type === "failure") {
				toast.error("エラーが発生しました");
				return;
			}

			toast.success("レビュアーを削除しました");
		});
	};

	return (
		<button
			onClick={handleClick}
			disabled={isPending}
			className="absolute top-0 right-0 w-5 h-5 translate-x-1/4 -translate-y-1/4 rounded-full border bg-destructive grid place-items-center group-hover:visible group-hover:opacity-100 invisible opacity-0 transition-all disabled:bg-muted"
		>
			<X className="w-full h-full" />
		</button>
	);
};
