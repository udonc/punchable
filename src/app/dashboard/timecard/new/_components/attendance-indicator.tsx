type AttendanceIndicatorProps = {
	type: "attend" | "absent" | "other" | "unset";
};
export const AttendanceIndicator = ({ type }: AttendanceIndicatorProps) => {
	return (
		<div
			data-type={type}
			className="h-2.5 w-2.5 rounded-full data-[type=unset]:ring-2 ring-inset ring-muted-foreground data-[type=attend]:bg-green-500 data-[type=absent]:bg-red-500 data-[type=other]:bg-yellow-500"
		/>
	);
};
