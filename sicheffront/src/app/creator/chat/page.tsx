"use client";
import React, { useState } from "react";

// Tipos de datos
interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
  time: string;
}

// Nuevo tipo para los usuarios del chat
interface ChatUser {
  id: number;
  name: string;
  lastMessage: string; // El mensaje que se ve en la vista previa
  avatar: string;
  unreadCount: number; // Cantidad de mensajes sin leer (0 si no hay nuevos)
  active: boolean; // Para saber cuál chat está seleccionado actualmente
}

export default function ChatInterface() {
  // 1. Estado del Input
  const [inputValue, setInputValue] = useState("");

  // 2. Estado de los Mensajes (Chat actual)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Bienvenidos todos al grupo!", sender: "me", time: "10:00" },
    {
      id: 2,
      text: "Hola que tal, un placer estar aqui!",
      sender: "other",
      time: "10:05",
    },
  ]);

  // 3. NUEVO: Estado de la lista de Usuarios (Sidebar)
  // Aquí simulamos que el segundo usuario tiene un mensaje muy largo y notificaciones
  const [users, setUsers] = useState<ChatUser[]>([
    {
      id: 1,
      name: "Luis",
      lastMessage: "hola, necesito ayuda con esta receta",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600",
      unreadCount: 2,
      active: false,
    },
    {
      id: 2,
      name: "Carolina",
      // Este texto es larguísimo para probar los 3 puntos (...)
      lastMessage: "Hola Sam, bienvenido",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
      unreadCount: 0, // <--- Aquí simulamos 3 mensajes nuevos
      active: true, // Simulamos que este es el chat abierto
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  return (
    <div className="container mx-auto shadow-lg rounded-lg h-screen overflow-hidden bg-[#181411]">
      {/* Header */}
      <div className="px-5 py-5 flex justify-between items-center bg-[#181411] border-b-2 border-gray-800">
        <div className="font-semibold text-2xl text-[#F57C00]">SiChef!</div>
        {/* <div className="w-1/2">
                    <input
                        type="text"
                        placeholder="search IRL"
                        className="rounded-2xl bg-gray-100 py-3 px-5 w-full outline-none text-black focus:border-[#F57C00]"
                    />
                </div> */}
        <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition">
          OZ
        </div>
      </div>

      {/* Chatting Section */}
      <div className="flex flex-row justify-between bg-[#181411] h-full">
        {/* Sidebar Izquierdo (Lista de usuarios DINÁMICA) */}
        <div className="flex flex-col w-2/5 border-r-2 border-gray-800 overflow-y-auto h-[calc(100vh-100px)]">
          <div className="border-b-2 border-gray-800 py-4 px-2">
            <input
              type="text"
              placeholder="search chatting"
              className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full outline-none focus:border-[#F57C00]"
            />
          </div>

          {/* Mapeamos los usuarios del estado */}
          {users.map((user) => (
            <div
              key={user.id}
              // Si está activo (seleccionado), le ponemos un fondo diferente
              className={`flex flex-row py-4 px-2 items-center border-b-2 border-gray-800 cursor-pointer transition relative
                                ${
                                  user.active
                                    ? "bg-orange-500/20"
                                    : "hover:bg-orange-500/10"
                                }`}
            >
              <div className="w-1/4">
                <img
                  src={user.avatar}
                  className="object-cover h-12 w-12 rounded-full"
                  alt="Profile"
                />
              </div>

              {/* Contenedor del texto con ancho fijo para obligar a cortar */}
              <div className="w-full overflow-hidden">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-white">
                    {user.name}
                  </div>
                  {/* Si hay mensajes sin leer, mostramos la hora o el badge */}
                  {user.unreadCount > 0 && (
                    <div className="bg-[#F57C00] text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                      {user.unreadCount}
                    </div>
                  )}
                </div>

                {/* TRUCO: 'truncate' corta el texto y pone '...' */}
                <p className="text-gray-500 truncate w-11/12 text-sm">
                  {user.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Área Principal del Chat */}
        <div className="w-full px-5 flex flex-col justify-between h-[calc(100vh-100px)]">
          <div className="flex flex-col mt-5 overflow-y-auto no-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                {msg.sender === "other" && (
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600"
                    className="object-cover h-8 w-8 rounded-full mr-2"
                    alt="Other"
                  />
                )}

                <div
                  className={`py-3 px-4 text-white max-w-[70%] break-words ${
                    msg.sender === "me"
                      ? "bg-[#F57C00] rounded-bl-3xl rounded-tl-3xl rounded-tr-xl mr-2"
                      : "bg-gray-600 rounded-br-3xl rounded-tr-3xl rounded-tl-xl ml-2"
                  }`}
                >
                  {msg.text}
                  <div className="text-xs text-white/70 text-right mt-1">
                    {msg.time}
                  </div>
                </div>

                {msg.sender === "me" && (
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600"
                    className="object-cover h-8 w-8 rounded-full"
                    alt="Me"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Input Area con Botón de Enviar */}
          <div className="py-5">
            <form
              onSubmit={handleSendMessage}
              className="relative flex items-center"
            >
              <input
                className="w-full bg-gray-300 py-4 pl-5 pr-16 rounded-xl outline-none focus:bg-gray-200 transition text-black placeholder-gray-500"
                type="text"
                placeholder="Escribe tu mensaje aquí..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />

              {/* Botón de Enviar (Flecha) */}
              <button
                type="submit"
                disabled={!inputValue.trim()} // (Opcional) Desactiva si está vacío
                className={`absolute right-2 p-3 bg-[#F57C00] rounded-full text-white shadow-md transition-all duration-200 flex items-center justify-center
                                    ${
                                      inputValue.trim()
                                        ? "hover:bg-orange-700 hover:scale-105"
                                        : "opacity-50 cursor-not-allowed"
                                    }
                                `}
              >
                {/* Icono SVG de "Avión de papel" / Flecha */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 ml-0.5" // ml-0.5 para centrar visualmente la flecha
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
