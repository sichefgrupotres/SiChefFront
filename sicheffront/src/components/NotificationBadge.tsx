import { useChat } from "@/context/ChatProvider";
import Link from "next/link";

export default function NotificationBadge() {
    const { totalUnread } = useChat();
    if (totalUnread === 0) return null;

    return (
        <Link href="/chat" className="relative">
            <div className="relative">
                {/* Ícono de chat */}
                <svg
                    className="w-6 h-6 text-gray-300 hover:text-white transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>

                {/* Badge de notificación */}
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    {totalUnread > 9 ? '9+' : totalUnread}
                </div>
            </div>
        </Link>

    );

}