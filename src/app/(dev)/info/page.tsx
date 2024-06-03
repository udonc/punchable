import { getIp } from "@/util/ip";
import type { NextPage } from "next";
import { headers } from "next/headers";

const header = headers();

const ip = getIp(header);

const page: NextPage = () => {
  return (
    <div className="bg-background p-4 grid gap-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      Your Informations
    </h1>
      <div className={"p-4 border border-border rounded-lg"}>
        <p>Your IP address is: <code className="text-secondary-foreground border border-border rounded px-1">{ip}</code></p>
      </div>
    </div>
  );
};

export default page;