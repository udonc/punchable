"use client";

import { createContext, ReactNode } from "react";

type SelfInfo = {
	id: string;
	name: string;
	slug: string;
	ip: string;
};

type SelfInfoProviderProps = {
	selfInfo: SelfInfo | null;
	children: ReactNode;
};

export const SelfInfoContext = createContext<SelfInfo | null>(null);

export const SelfInfoProvider = ({
	selfInfo,
	children,
}: SelfInfoProviderProps) => {
	return (
		<SelfInfoContext.Provider value={selfInfo}>
			{children}
		</SelfInfoContext.Provider>
	);
};
