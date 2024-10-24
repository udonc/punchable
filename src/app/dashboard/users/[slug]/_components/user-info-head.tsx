import { Button } from "@/components/ui/button";
import Avatar from "boring-avatars";
import Link from "next/link";

type UserInfoHeadProps = {
	user: {
		slug: string;
		name: string;
	};
};

export const UserInfoHead = ({ user }: UserInfoHeadProps) => {
	return (
		<Button variant="link" className="p-0 m-0" asChild>
			<Link href={`/dashboard/users/${user.slug}`}>
				<div className="flex gap-2 items-center h-9 min-w-32">
					<Avatar size={40} name={user.slug} variant="beam" />
					<div className="grid h-full">
						<span>{user.name}</span>
						<span className="text-sm text-muted-foreground">{user.slug}</span>
					</div>
				</div>
			</Link>
		</Button>
	);
};
