"use client";

import { FormControl, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ReactNode } from "react";

type CreateTimecardFormUserListItem = {
	user: {
		id: string;
		name: string;
		slug: string;
	};
	value: string;
	children: ReactNode;
};

export const CreateTimecardFormUserListItem = ({
	user,
	value,
	children,
}: CreateTimecardFormUserListItem) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: user.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<FormItem tabIndex={-1}>
			<Label
				data-dragging={isDragging}
				ref={setNodeRef}
				style={style}
				{...attributes}
				className="relative px-4 py-3 flex items-center gap-1 data-[dragging=true]:opacity-0 bg-background border select-none rounded-md has-[:checked]:bg-primary has-[:checked]:text-primary-foreground group space-y-0"
			>
				<FormControl className="sr-only">
					<RadioGroupItem value={value} />
				</FormControl>
				<div className="text-nowrap text-ellipsis overflow-hidden">
					{children}
				</div>
				<div
					className="absolute left-0 -translate-x-1/2 hover:bg-muted p-1 rounded bg-background border group-hover:visible invisible"
					{...listeners}
				>
					<GripVertical
						size={12}
						className="cursor-move text-muted-foreground"
					/>
				</div>
			</Label>
		</FormItem>
	);
};
