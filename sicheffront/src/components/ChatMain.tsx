"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { useChat } from "@/context/ChatProvider";
import { useSession } from "next-auth/react";
import PremiumModal from "@/components/PremiumModal";

export default function ChatMain() {
    // 1. TODOS LOS HOOKS (Siempre arriba)
    const { users, messages, activeRoom, joinRoom, sendMessage, currentUser, isLoadingHistory } = useChat();
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { data: session, status } = useSession();

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;
        const query = searchQuery.toLowerCase();
        return users.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.lastMessage?.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    useEffect(() => {
        if (!isLoadingHistory && messages.length > 0) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
            }, 100);
        }
    }, [messages.length, activeRoom, isLoadingHistory]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue("");
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const activeUser = users.find(u => activeRoom.includes(u.email));
    const currentChatName = activeUser?.name || "Chat";
    const currentChatAvatar = activeUser?.avatar || "/chef-avatar.jpg";

    // 2. LÓGICA DE ACCESO
    if (status === "loading") {
        return <div className="h-screen w-full bg-[#181411] flex items-center justify-center text-gray-500">Cargando...</div>;
    }

    const user = session?.user as any;
    const userRole = user?.role?.toLowerCase();

    const isCreator = userRole === "creator" || userRole === "chef";

    // 👇 CORRECCIÓN: Estandarizamos la lógica Premium aquí
    const isPremium = user?.isPremium === true || user?.role === "PREMIUM";

    // 3. RETORNO CONDICIONAL (Seguridad)
    if (!isCreator && !isPremium) {
        return (
            <PremiumModal
                isOpen={true}
                onClose={() => { }}
            />
        );
    }

    // 4. RENDERIZADO DEL CHAT
    return (
        <div className="fixed top-0 bottom-0 right-0 left-20 lg:left-64 bg-[#181411] flex overflow-hidden transition-all duration-300">
            {/* SIDEBAR */}
            <aside className="hidden md:flex flex-col w-2/5 border-r border-gray-800 bg-[#1f1a16]">
                <div className="p-5 border-b border-gray-800 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-[#F57C00]">SiChef!</h2>
                    <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                        {currentUser?.avatar ? (
                            <img src={currentUser.avatar} alt="me" className="w-full h-full object-cover" />
                        ) : (
                            currentUser?.name?.substring(0, 2).toUpperCase()
                        )}
                    </div>
                </div>

                <div className="p-4 shrink-0">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar chef..."
                        className="w-full bg-[#120f0c] border border-gray-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#F57C00] transition"
                    />
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 p-2">
                    {filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                            <span className="text-3xl mb-2">🔍</span>
                            <p className="text-sm">No se encontraron chefs</p>
                        </div>
                    ) : (
                        filteredUsers.map((user) => {
                            const isActive = activeRoom.includes(user.email);

                            return (
                                <div
                                    key={user.id}
                                    onClick={() => joinRoom(user)}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 relative
                    ${isActive ? "bg-[#F57C00] text-white shadow-lg" : "text-gray-400 hover:bg-white/5"}
                  `}
                                >
                                    <div className="relative shrink-0">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover bg-gray-800 border border-white/10"
                                        />
                                        {user.unreadCount! > 0 && !isActive && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                                                {user.unreadCount! > 9 ? '9+' : user.unreadCount}
                                            </div>
                                        )}
                                    </div>

                                    <div className="overflow-hidden flex-1">
                                        <h4 className="font-semibold text-sm truncate">
                                            {user.name}
                                        </h4>
                                        <p className={`text-xs truncate ${isActive ? "text-orange-100" : "text-gray-500"}`}>
                                            {user.lastMessage || 'Disponible'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </aside>

            {/* CHAT AREA */}
            <main className="flex-1 flex flex-col bg-[#181411]">
                {!activeUser ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 select-none">
                        <span className="text-6xl mb-4 grayscale opacity-20">👨‍🍳</span>
                        <h3 className="text-xl font-bold text-gray-400">Bienvenido a SiChef!</h3>
                        <p className="text-sm opacity-60 mt-2">Selecciona un chat para comenzar.</p>
                    </div>
                ) : (
                    <>
                        <header className="border-b border-gray-800 flex items-center px-6 py-4 bg-[#1f1a16]/50 backdrop-blur-md shrink-0">
                            <div className="flex items-center gap-3">
                                <img
                                    src={currentChatAvatar}
                                    alt={currentChatName}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-[#F57C00]"
                                />
                                <div>
                                    <h3 className="text-white font-bold text-lg">{currentChatName}</h3>
                                </div>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                            {isLoadingHistory && (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F57C00]"></div>
                                </div>
                            )}

                            {messages.length === 0 && !isLoadingHistory && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                                    <span className="text-4xl mb-2">👋</span>
                                    <p>Saluda a {currentChatName}...</p>
                                </div>
                            )}

                            {messages.map((msg, index) => {
                                const isMe = msg.sender === "me";
                                const avatarToShow = isMe ? currentUser?.avatar : currentChatAvatar;

                                return (
                                    <div
                                        key={`${msg.id}-${index}`}
                                        className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
                                    >
                                        {!isMe && (
                                            <img
                                                src={avatarToShow}
                                                alt="sender"
                                                className="w-6 h-6 rounded-full object-cover mb-1 border border-gray-600 shrink-0"
                                            />
                                        )}

                                        <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm relative break-words ${isMe
                                            ? "bg-[#F57C00] text-white rounded-tr-sm"
                                            : "bg-[#2a2521] text-gray-200 rounded-tl-sm border border-gray-700"
                                            }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                            <span className={`block mt-1 text-[9px] text-right opacity-60 ${isMe ? "text-gray-400" : "text-gray-500"
                                                }`}>
                                                {msg.time}
                                            </span>
                                        </div>

                                        {isMe && (
                                            <img
                                                src={currentUser?.avatar}
                                                alt="me"
                                                className="w-6 h-6 rounded-full object-cover mb-1 border border-[#F57C00] shrink-0"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-[#1f1a16] border-t border-gray-800 shrink-0">
                            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 bg-[#120f0c] text-white px-5 py-3 rounded-xl border border-gray-700 focus:border-[#F57C00] outline-none transition placeholder-gray-600"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="bg-[#F57C00] hover:bg-orange-600 text-white p-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ➤
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}