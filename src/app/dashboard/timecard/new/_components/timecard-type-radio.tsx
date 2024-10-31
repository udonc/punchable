import { FormControl, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";

type TimecardTypeRadioProps = {
	children: ReactNode;
} & ComponentProps<typeof RadioGroupItem>;

export const TimecardTypeRadio = ({
	children,
	className,
	...props
}: TimecardTypeRadioProps) => {
	return (
		<FormItem>
			<Label
				className={cn(
					"block px-4 py-3 bg-background has-[:checked]:bg-primary has-[:checked]:text-primary-foreground cursor-pointer",
					className,
				)}
			>
				<FormControl className="sr-only">
					<RadioGroupItem {...props} />
				</FormControl>
				<div>{children}</div>
			</Label>
		</FormItem>
	);
};
