import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";

type TimecardTypeRadioProps = {
	children: ReactNode;
} & ComponentProps<"input">;

export const TimecardTypeRadio = ({
	children,
	className,
	...props
}: TimecardTypeRadioProps) => {
	return (
		<Label
			className={cn(
				"p-4 bg-background has-[:checked]:bg-primary has-[:checked]:text-primary-foreground cursor-pointer",
				className,
			)}
		>
			<Input type="radio" value="attend" className="hidden" {...props} />
			{children}
		</Label>
	);
};
