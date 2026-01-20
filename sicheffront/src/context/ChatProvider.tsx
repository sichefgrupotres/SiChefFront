"use client";
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import {
    registerServiceWorker,
    requestNotificationPermission,
    subscribeToPushNotifications
} from "@/utils/pushNotifications";

export interface Message {
    id: number;
    text: string;
    sender: "me" | "other";
    time: string;
    senderName?: string;
    senderAvatar?: string;
}

export interface ChatUser {
    id: string | number;
    name: string;
    email: string;
    avatar: string;
    unreadCount?: number;
    lastMessage?: string;
    timestamp?: number;
}

interface ChatContextType {
    users: ChatUser[];
    messages: Message[];
    activeRoom: string;
    isLoadingHistory: boolean;
    totalUnread: number;
    joinRoom: (user: ChatUser) => void;
    sendMessage: (text: string) => void;
    currentUser: { name: string; avatar: string };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

let socket: Socket | null = null;

export function ChatProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();

    const [messages, setMessages] = useState<Message[]>([]);
    // CAMBIO 1: El estado inicial ya no es "general", empieza vacío.
    const [activeRoom, setActiveRoom] = useState("");
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [totalUnread, setTotalUnread] = useState(0);

    const activeRoomRef = useRef(activeRoom);
    useEffect(() => { activeRoomRef.current = activeRoom; }, [activeRoom]);

    const sessionUser = session?.user as any;
    const myEmail = sessionUser?.email?.toLowerCase() || "";
    const myName = sessionUser?.name || "Yo";
    const myAvatar = sessionUser?.image || sessionUser?.avatarUrl || `https://ui-avatars.com/api/?name=${myName}&background=F57C00&color=fff`;

    // CAMBIO 2: Lógica de room simplificada (solo chats privados 1 a 1)
    const getRoomId = (email1: string, email2: string) => {
        return [email1.toLowerCase(), email2.toLowerCase()].sort().join('_');
    };

    const playSound = () => {
        try {
            new Audio('https://cdn.freesound.org/previews/536/536108_11678707-lq.mp3').play().catch(() => { });
        } catch (e) {
            console.log("No se pudo reproducir el sonido");
        }
    };

    // REGISTRAR SERVICE WORKER Y PUSH NOTIFICATIONS
    useEffect(() => {
        if (!session?.backendToken || !myEmail) return;

        const setupPushNotifications = async () => {
            await registerServiceWorker();
            const permission = await requestNotificationPermission();
            if (permission === 'granted') {
                await subscribeToPushNotifications(myEmail);
                console.log('🔔 Push notifications habilitadas');
            }
        };

        setupPushNotifications();
    }, [session, myEmail]);

    // CARGA INICIAL DE USUARIOS
    useEffect(() => {
        if (!session?.backendToken || !myEmail) return;

        const initData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/chat-list`, {
                    headers: { Authorization: `Bearer ${session.backendToken}` }
                });

                if (res.ok) {
                    const rawUsers = await res.json();
                    const storageKey = `chat_v5_${myEmail}`;
                    const savedData = localStorage.getItem(storageKey);
                    const memory = savedData ? JSON.parse(savedData) : {};

                    const processedUsers = rawUsers
                        .filter((u: any) => u.email.toLowerCase() !== myEmail)
                        .map((u: any) => {
                            const k = u.email.toLowerCase();
                            const mem = memory[k];
                            return {
                                ...u,
                                email: k,
                                avatar: u.avatar || `https://ui-avatars.com/api/?name=${u.name}`,
                                unreadCount: mem?.unreadCount || 0,
                                lastMessage: mem?.lastMessage || "Disponible",
                                timestamp: mem?.timestamp || 0
                            };
                        });

                    // CAMBIO 3: Eliminamos la creación del objeto "general" y su inyección en la lista.
                    // Solo ordenamos por timestamp (el más reciente arriba).
                    const list = processedUsers.sort((a: ChatUser, b: ChatUser) => {
                        return (b.timestamp || 0) - (a.timestamp || 0);
                    });

                    setUsers(list);

                    const total = list.reduce((sum: number, u: ChatUser) => sum + (u.unreadCount || 0), 0);
                    setTotalUnread(total);
                }
            } catch (e) {
                console.error("Error cargando usuarios:", e);
            }
        };
        initData();
    }, [session, myEmail]);

    // PERSISTENCIA
    useEffect(() => {
        if (users.length && myEmail) {
            const map = users.reduce((acc, u) => ({ ...acc, [u.email]: u }), {});
            localStorage.setItem(`chat_v5_${myEmail}`, JSON.stringify(map));

            const total = users.reduce((sum, u) => sum + (u.unreadCount || 0), 0);
            setTotalUnread(total);
        }
    }, [users, myEmail]);

    // WEBSOCKETS CON LÓGICA "ANTI-SLEEP"
    useEffect(() => {
        if (!session?.backendToken || !myEmail) return;

        // 1. Configuración robusta del Socket
        if (!socket) {
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            socket = io(backendUrl.replace('/api', ''), {
                reconnection: true,             // Permitir reconexión automática
                reconnectionAttempts: Infinity, // Intentar por siempre
                reconnectionDelay: 1000,        // Esperar 1 seg entre intentos
                reconnectionDelayMax: 5000,     // Máximo 5 segs
                timeout: 20000,                 // Si en 20s no responde, asumir muerto
                autoConnect: true,
            });
        }

        // 2. Función para "revivir" la conexión
        const handleReconnection = () => {
            console.log("🔄 Intentando recuperar conexión...");
            if (socket) {
                // Le decimos al servidor quiénes somos de nuevo
                socket.emit('setup-user', myEmail);
                // Si teníamos una sala abierta, nos unimos de nuevo
                if (activeRoomRef.current) {
                    socket.emit('join-room', activeRoomRef.current);
                }
            }
        };

        // EVENTOS DEL SOCKET
        socket.on("connect", () => {
            console.log("🟢 WebSocket conectado/recuperado");
            handleReconnection(); // Ejecutamos la lógica de resurrección
        });

        socket.on("disconnect", (reason) => {
            console.warn("🔴 WebSocket desconectado:", reason);
            // Si el servidor nos echó, intentamos volver a entrar
            if (reason === "io server disconnect") {
                socket?.connect();
            }
        });

        socket.on("load-history", (history: any[]) => {
            const formatted = history.map(msg => ({
                id: msg.id,
                text: msg.text,
                sender: (msg.sender === myName ? "me" : "other") as "me" | "other",
                senderName: msg.sender,
                senderAvatar: msg.avatar,
                time: msg.time
            }));
            setMessages(formatted);
            setIsLoadingHistory(false);
        });

        socket.on("nuevo-mensaje", (payload: any) => {
            // ... (Toda tu lógica de nuevo mensaje que ya tenías, déjala IGUAL aquí) ...
            // Copia y pega tu lógica interna de 'nuevo-mensaje' aquí adentro
            const incomingEmail = payload.email?.toLowerCase();
            const isMe = incomingEmail === myEmail;
            const messageRoomId = payload.room;
            const currentRoom = activeRoomRef.current;

            if (messageRoomId === currentRoom) {
                setMessages(prev => [...prev, {
                    id: payload.id || Date.now(),
                    text: payload.text,
                    sender: isMe ? "me" : "other",
                    senderName: payload.sender,
                    senderAvatar: payload.avatar,
                    time: payload.time
                }]);
            } else if (!isMe) {
                playSound();
                if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
                    new Notification('Nuevo mensaje en SiChef', {
                        body: `${payload.sender}: ${payload.text}`,
                        icon: payload.avatar || '/chef-avatar.jpg',
                        badge: '/chef-avatar.jpg'
                    });
                }
            }

            setUsers(prevList => {
                const list = [...prevList];
                let targetEmail = "";

                if (isMe) {
                    const parts = messageRoomId.split('_');
                    targetEmail = parts.find((e: string) => e !== myEmail) || "";
                } else {
                    targetEmail = incomingEmail;
                }

                const idx = list.findIndex(u => u.email === targetEmail);
                if (idx === -1) return prevList;

                const userToUpdate = { ...list[idx] };
                userToUpdate.lastMessage = payload.text;
                userToUpdate.timestamp = Date.now();

                if (!isMe && messageRoomId !== currentRoom) {
                    userToUpdate.unreadCount = (userToUpdate.unreadCount || 0) + 1;
                }

                list.splice(idx, 1);
                list.unshift(userToUpdate);

                return list;
            });
        });

        // 3. EL TRUCO DE ORO: Listener de Foco de Ventana
        // Esto detecta cuando el usuario vuelve a la pestaña y fuerza un chequeo
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log("👁️ Usuario volvió a la pestaña. Chequeando salud del socket...");
                if (socket && !socket.connected) {
                    console.log("🔌 Socket dormido. Despertando...");
                    socket.connect();
                } else {
                    // Aunque esté conectado, refrescamos el setup por si acaso el servidor reinició
                    socket?.emit('setup-user', myEmail);
                }
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleVisibilityChange);

        // Si el socket no está conectado al iniciar este efecto, conectarlo
        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket?.off("connect");
            socket?.off("disconnect"); // Importante limpiar este también
            socket?.off("load-history");
            socket?.off("nuevo-mensaje");
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleVisibilityChange);
        };
    }, [session, myEmail, myName]);

    const joinRoom = (targetUser: ChatUser) => {
        if (!socket || !myEmail) return;

        const newRoom = getRoomId(myEmail, targetUser.email);
        if (newRoom === activeRoom) return;

        setUsers(prev => prev.map(u =>
            u.email === targetUser.email ? { ...u, unreadCount: 0 } : u
        ));

        setActiveRoom(newRoom);
        setMessages([]);
        setIsLoadingHistory(true);

        socket.emit('join-room', newRoom);
    };

    const sendMessage = (text: string) => {
        // Validación extra: no enviar si no hay sala seleccionada
        if (!socket || !text.trim() || !activeRoom) return;

        socket.emit('enviar-mensaje', {
            text,
            sender: myName,
            email: myEmail,
            avatar: myAvatar,
            room: activeRoom
        });
    };

    return (
        <ChatContext.Provider value={{
            users,
            messages,
            activeRoom,
            isLoadingHistory,
            totalUnread,
            joinRoom,
            sendMessage,
            currentUser: { name: myName, avatar: myAvatar }
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat debe usarse dentro de ChatProvider");
    }
    return context;
}