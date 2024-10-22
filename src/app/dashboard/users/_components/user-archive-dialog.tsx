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
import { archiveUser } from "../_actions/user";
import { ArchiveUserInput } from "../schema";

type UserArchiveDialogProps = {
	user: {
		id: string;
		name: string;
		slug: string;
	};
};

export type UserArchiveDialogHandlers = {
	openDialog: () => void;
};

export const UserArchiveDialog = forwardRef<
	UserArchiveDialogHandlers,
	UserArchiveDialogProps
>(({ user }, ref) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);

	useImperativeHandle(ref, () => ({
		openDialog: () => setIsOpen(true),
	}));

	const form = useForm<z.infer<typeof ArchiveUserInput>>({
		resolver: zodResolver(ArchiveUserInput),
		mode: "onSubmit",
	});

	const onSubmit = async (data: z.infer<typeof ArchiveUserInput>) => {
		startTransition(async () => {
			const result = await archiveUser(user.id);

			if (result._type === "failure") {
				console.error(result.error);
				toast.error("エラーが発生しました");
				return;
			}

			toast.success("ユーザーをアーカイブしました");
			setIsOpen(false);
		});
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						ユーザー &quot;{user.name}&quot; をアーカイブしますか？
					</AlertDialogTitle>
					<AlertDialogDescription>
						アーカイブしたユーザーは読み取り専用になります。
					</AlertDialogDescription>
					<AlertDialogDescription>
						アーカイブするには
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
								アーカイブ
							</AlertDialogAction>
						</form>
					</Form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
});

UserArchiveDialog.displayName = "UserDeleteDialog";
