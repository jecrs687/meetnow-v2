import { PrivateHeader } from "@common/navigation/private-header";
import { PrivateSidebar } from "@common/navigation/private-sidebar";
import { AuthProvider } from "@common/providers/auth-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MeetNow - Dashboard",
    description: "Your personal dashboard for MeetNow.",
};

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <PrivateHeader />
                <div className="flex flex-1">
                    <PrivateSidebar />
                    <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                        <div className="container-content animate-fade-in">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}
