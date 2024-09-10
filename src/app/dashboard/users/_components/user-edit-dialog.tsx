"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPen } from "lucide-react";
import {
	forwardRef,
	useImperativeHandle,
	useState,
	useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
	checkDuplicateIp,
	checkDuplicateSlug,
	updateUser,
} from "../_actions/user";
import { UpdateUserInput } from "../schema";

type UserEditDialogProps = {
	id: string;
	oldUser: {
		name: string;
		slug: string;
		ip: string;
	};
};

export type UserEditDialogHandlers = {
	openDialog: () => void;
};

export const UserEditDialog = forwardRef<
	UserEditDialogHandlers,
	UserEditDialogProps
>(({ id, oldUser: currentUser }, ref) => {
	const form = useForm<z.infer<typeof UpdateUserInput>>({
		resolver: zodResolver(UpdateUserInput),
		mode: "onSubmit",
		defaultValues: currentUser,
	});

	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	useImperativeHandle(ref, () => ({
		openDialog: () => setIsOpen(true),
	}));

	const onSubmit = async (data: z.infer<typeof UpdateUserInput>) => {
		startTransition(async () => {
			const [checkSlugResult, checkIpResult] = await Promise.all([
				checkDuplicateSlug(data.slug),
				checkDuplicateIp(data.ip),
			]);

			if (checkSlugResult._type === "failure") {
				console.error(checkSlugResult.error);
				toast.error("エラーが発生しました");
				return;
			}

			if (checkSlugResult.value.duplicated && currentUser.slug !== data.slug) {
				form.setError("slug", {
					type: "manual",
					message: "このスラッグは既に使用されています",
				});
				return;
			}

			if (checkIpResult._type === "failure") {
				console.error(checkIpResult.error);
				toast.error("エラーが発生しました");
				return;
			}

			if (checkIpResult.value.duplicated && currentUser.ip !== data.ip) {
				form.setError("ip", {
					type: "manual",
					message: "このIPアドレスは既に使用されています",
				});
				return;
			}

			const result = await updateUser(id, data);

			if (result._type === "failure") {
				console.error(result.error);
				toast.error("エラーが発生しました");
				return;
			}

			toast.success("ユーザー情報を更新しました");
			setIsOpen(false);
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-1">
						<UserRoundPen />
						ユーザー情報の編集
					</DialogTitle>
					<DialogDescription>
						新しいユーザーの情報を入力してください。
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>名前</FormLabel>
										<FormControl>
											<Input placeholder="金城" {...field} />
										</FormControl>
										<div className="h-10">
											<FormDescription>
												Human-readable なユーザーの名前
											</FormDescription>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="slug"
								render={({ field }) => (
									<FormItem>
										<FormLabel>スラッグ</FormLabel>
										<FormControl>
											<Input placeholder="kinjou" {...field} />
										</FormControl>
										<div className="h-10">
											<FormDescription>
												URLに使用されるユーザーのスラッグ (半角英数字, ハイフン)
											</FormDescription>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="ip"
								render={({ field }) => (
									<FormItem>
										<FormLabel>IP アドレス</FormLabel>
										<FormControl>
											<Input placeholder="::1" {...field} />
										</FormControl>
										<div className="h-10">
											<FormDescription>ユーザーのIPアドレス</FormDescription>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" disabled={isPending}>
							{isPending ? "送信中..." : "編集完了"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
});

UserEditDialog.displayName = "UserEditDialog";
