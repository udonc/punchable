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
import { Input } from "@/components/ui/input";
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
import { deleteUser } from "../_actions/user";
import { DeleteUserInput } from "../schema";

type UserDeleteDialogProps = {
	user: {
		id: string;
		name: string;
		slug: string;
	};
};

export type UserDeleteDialogHandlers = {
	openDialog: () => void;
};

export const UserDeleteDialog = forwardRef<
	UserDeleteDialogHandlers,
	UserDeleteDialogProps
>(({ user }, ref) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);

	useImperativeHandle(ref, () => ({
		openDialog: () => setIsOpen(true),
	}));

	const form = useForm<z.infer<typeof DeleteUserInput>>({
		resolver: zodResolver(DeleteUserInput),
		mode: "onSubmit",
	});

	const onSubmit = async (data: z.infer<typeof DeleteUserInput>) => {
		startTransition(async () => {
			const result = await deleteUser(user.id);

			if (result._type === "failure") {
				toast.error(result.error);
				return;
			}

			toast.success("ユーザーを削除しました");
			setIsOpen(false);
		});
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						ユーザー &quot;{user.name}&quot; を削除しますか？
					</AlertDialogTitle>
					<AlertDialogDescription>
						ユーザーとそれに関連するデータがすべて削除されます。
						<br />
						この操作は取り消せません。
					</AlertDialogDescription>
					<AlertDialogDescription>
						削除するには
						<code className="font-mono mx-1 px-1 bg-background border border-border/50 rounded">
							{user.slug}
						</code>
						と入力してください。
					</AlertDialogDescription>
					<Input
						onInput={(e) => setIsDisabled(e.currentTarget.value !== user.slug)}
					/>
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
								disabled={isDisabled}
								className={buttonVariants({ variant: "destructive" })}
							>
								削除
							</AlertDialogAction>
						</form>
					</Form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
});

UserDeleteDialog.displayName = "UserDeleteDialog";
