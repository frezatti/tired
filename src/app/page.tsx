import Link from "next/link";

import { LatestPost } from "@/app/_components/post";
import { api, HydrateClient } from "@/trpc/server";
import OpenModal from "@/components/stock/modal";

export default async function Home() {

    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
                App (in progress, please wait)
                <OpenModal />
            </main>
        </HydrateClient>
    );
}
