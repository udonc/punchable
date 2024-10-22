import Avatar from "boring-avatars";

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
			<div className="grid">
				<span>{user.name}</span>
				<span className="text-sm text-muted-foreground">{user.slug}</span>
			</div>
		</div>
	);
};
