"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import { PlusCircle, UserRoundPlus } from "lucide-react";
import { useState, useTransition, type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
	checkDuplicateIp,
	checkDuplicateSlug,
	createUser,
} from "../_actions/user";
import { CreateUserInput } from "../schema";

export const UserCreationButton: FC = () => {
	const form = useForm<z.infer<typeof CreateUserInput>>({
		resolver: zodResolver(CreateUserInput),
		mode: "onSubmit",
		defaultValues: {
			name: "",
			slug: "",
			ip: "",
		},
	});

	const [isPending, startTransition] = useTransition();

	const onSubmit = async (data: z.infer<typeof CreateUserInput>) => {
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

			if (checkSlugResult.value.duplicated) {
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

			if (checkIpResult.value.duplicated) {
				form.setError("ip", {
					type: "manual",
					message: "このIPアドレスは既に使用されています",
				});
				return;
			}

			const result = await createUser(data);

			if (result._type === "failure") {
				console.error(result.error);
				toast.error("エラーが発生しました");
				return;
			}

			toast.success("ユーザーを作成しました");
			form.reset();
			setIsOpen(false);
		});
	};

	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="default">
					<PlusCircle className="mr-2 w-4 h-4" />
					新しいユーザーを作成
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-1">
						<UserRoundPlus />
						ユーザーを作成
					</DialogTitle>
					<DialogDescription>
						新規作成するユーザーの情報を入力してください。
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
							{isPending ? "送信中..." : "作成"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
