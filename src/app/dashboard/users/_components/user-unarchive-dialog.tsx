import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	forwardRef,
	startTransition,
	useImperativeHandle,
	useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { unarchiveUser } from "../_actions/user";
import { UnarchiveUserInput } from "../schema";

type UserUnarchiveDialogProps = {
	user: {
		id: string;
		name: string;
		slug: string;
	};
};

export type UserUnarchiveDialogHandlers = {
	openDialog: () => void;
};

export const UserUnarchiveDialog = forwardRef<
	UserUnarchiveDialogHandlers,
	UserUnarchiveDialogProps
>(({ user }, ref) => {
	const [isOpen, setIsOpen] = useState(false);

	useImperativeHandle(ref, () => ({
		openDialog: () => setIsOpen(true),
	}));

	const form = useForm<z.infer<typeof UnarchiveUserInput>>({
		resolver: zodResolver(UnarchiveUserInput),
		mode: "onSubmit",
	});

	const onSubmit = async (data: z.infer<typeof UnarchiveUserInput>) => {
		startTransition(async () => {
			const result = await unarchiveUser(user.id);

			if (result._type === "failure") {
				console.error(result.error);
				toast.error("エラーが発生しました");
				return;
			}

			toast.success("ユーザーのアーカイブ状態を解除しました");
			setIsOpen(false);
		});
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						ユーザー &quot;{user.name}&quot; をアーカイブ解除しますか？
					</AlertDialogTitle>
					<AlertDialogDescription>
						ユーザーのアーカイブ状態を解除して再度操作可能にします。
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<Form {...form}>
						<form
							className="sm:space-x-2"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<AlertDialogCancel>キャンセル</AlertDialogCancel>
							<AlertDialogAction
								type="submit"
								className={buttonVariants({ variant: "destructive" })}
							>
								アーカイブを解除する
							</AlertDialogAction>
						</form>
					</Form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
});

UserUnarchiveDialog.displayName = "UserDeleteDialog";
