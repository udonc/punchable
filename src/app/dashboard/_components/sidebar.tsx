"use client";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import type { FC, ReactNode } from "react";

type SidebarButtonProps = {
	/** ツールチップのトリガーとして表示されるコンポーネントです。 */
	trigger: ReactNode;
	/** ツールチップに表示されるコンテンツです。
	 * このプロパティが `string` 型の場合かつ `label` プロパティが指定されていないとき、
	 *  `aria-label` としても使用されます。*/
	content: ReactNode;
	/** `aria-label` に使用されます。 */
	label?: string;
	/** ボタンがアクティブかどうかを判定する際に使用される Pathname */
	activePath?: string;
};

export const SidebarButton: FC<SidebarButtonProps> = ({
	trigger,
	content,
	label,
	activePath,
}) => {
	const pathname = usePathname();

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					asChild
					className={cn(activePath === pathname && "rounded-lg bg-muted")}
					aria-label={label || (typeof content === "string" ? content : "")}
				>
					{trigger}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="right" sideOffset={5}>
				{content}
			</TooltipContent>
		</Tooltip>
	);
};
