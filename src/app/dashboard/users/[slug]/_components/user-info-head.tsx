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
		<div className="flex gap-2 items-center">
			<Avatar size={40} name={user.slug} variant="beam" />
			<Button variant="link" className="grid p-0 m-0" asChild>
				<Link href={`/dashboard/users/${user.slug}`}>
					<span>{user.name}</span>
					<span className="text-sm text-muted-foreground">{user.slug}</span>
				</Link>
			</Button>
		</div>
	);
};
