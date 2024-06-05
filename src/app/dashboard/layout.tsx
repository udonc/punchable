import { TooltipProvider } from "@/components/ui/tooltip";
import {
	BookUser,
	CalendarPlus,
	CalendarSearch,
	FileSpreadsheet,
	NotebookText,
	Origami,
	Settings,
	UserRoundSearch,
} from "lucide-react";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { SidebarButton } from "./_components/sidebar";

type Layout<T = {}> = FC<{ children: ReactNode } & T>;

const Layout: Layout = ({ children }) => {
	return (
		<TooltipProvider delayDuration={100}>
			<div className="flex min-h-screen w-full flex-col bg-muted/40">
				<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
					<nav className="flex flex-col items-center gap-4 p-2">
						<h1 className="aspect-square w-full grid place-items-center text-yellow-200">
							<Link href="/dashboard">
								<Origami />
							</Link>
						</h1>
					</nav>
					<hr />
					<nav className="flex flex-col items-center gap-4 p-2">
						<SidebarButton
							trigger={
								<Link href="/dashboard">
									<CalendarPlus />
								</Link>
							}
							content="勤怠打刻"
						/>
						<SidebarButton
							trigger={
								<Link href="/dashboard">
									<CalendarSearch />
								</Link>
							}
							content="勤怠状況"
						/>
						<SidebarButton
							trigger={
								<Link href="/dashboard">
									<FileSpreadsheet />
								</Link>
							}
							content="勤怠データダウンロード"
						/>
					</nav>
					<hr />
					<nav className="flex flex-col items-center gap-4 p-2">
						<SidebarButton
							trigger={
								<Link href="/dashboard">
									<NotebookText />
								</Link>
							}
							content="日報"
						/>
						<SidebarButton
							trigger={
								<Link href="/dashboard">
									<UserRoundSearch />
								</Link>
							}
							content="日報レビュー"
						/>
					</nav>
					<hr />
					<nav className="flex flex-col items-center gap-4 p-2">
						<SidebarButton
							trigger={
								<Link href="/dashboard">
									<BookUser />
								</Link>
							}
							content="ユーザー管理"
						/>
					</nav>
					<div className="h-full">{/* Spacer */}</div>
					<hr />
					<nav className="flex flex-col items-center gap-4 p-2">
						<SidebarButton
							trigger={
								<Link href="/dashboard">
									<Settings />
								</Link>
							}
							content="設定"
						/>
					</nav>
				</aside>
				<main className="w-full min-h-screen sm:pl-14">{children}</main>
			</div>
		</TooltipProvider>
	);
};

export default Layout;
