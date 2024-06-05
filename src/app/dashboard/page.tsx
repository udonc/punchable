import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { NextPage } from "next";

const page: NextPage = () => {
	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={25} minSize={10}>
				<div className="bg-red-500">Panel 1</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={75} minSize={10}>
				<div className="bg-blue-500">Panel 2</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};

export default page;
