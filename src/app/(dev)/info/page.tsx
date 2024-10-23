import { db } from "@/server/db";
import { getIp } from "@/util/ip";
import type { NextPage } from "next";
import { headers } from "next/headers";

const page: NextPage = async () => {
	const header = await headers();
	const ip = getIp(header) || "";

	const user = await db.user
		.findUnique({
			where: {
				ip: ip,
			},
		})
		.then((res) => res);

	return (
		<div className="bg-background p-4 grid gap-4">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				IP Information
			</h1>
			<div className={"p-4 border border-border rounded-lg grid gap-2"}>
				<p>
					Your IP address is:{" "}
					<code className="text-secondary-foreground border border-border rounded px-1">
						{ip}
					</code>
				</p>
				{user ? (
					<p>
						This IP address is associated with the user:{" "}
						<code className="text-secondary-foreground border border-border rounded px-1">
							{user.name}
						</code>
					</p>
				) : (
					<p>This IP address is not associated with any user.</p>
				)}
			</div>
		</div>
	);
};

export default page;
