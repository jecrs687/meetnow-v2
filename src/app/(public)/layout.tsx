import { PublicHeader } from "@common/navigation/public-header";
import { PublicFooter } from "@common/navigation/public-footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MeetNow - Connect and Meet New People",
    description: "Join MeetNow to discover events, connect with like-minded individuals, and create memorable experiences.",
};

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader />
            <main className="flex-grow">{children}</main>
            <PublicFooter />
        </div>
    );
}
