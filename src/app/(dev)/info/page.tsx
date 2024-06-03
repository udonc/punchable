import { getIp } from "@/util/ip";
import type { NextPage } from "next";
import { headers } from "next/headers";

const header = headers();

const ip = getIp(header);

const page: NextPage = () => {
  return (
    <div>
      <h1>Your Info</h1>
      <p>Your IP address is <code>{ip}</code></p>
    </div>
  );
};

export default page;