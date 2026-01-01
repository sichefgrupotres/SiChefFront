import React from 'react';

export default function ChatInterface() {
    return (
        // Container principal
        <div className="container mx-auto shadow-lg rounded-lg h-screen overflow-hidden bg-[#181411]">

            {/* Header */}
            <div className="px-5 py-5 flex justify-between items-center bg-[#181411] border-b-2">
                <div className="font-semibold text-2xl text-[#F57C00]">SiChef!</div>
                <div className="w-1/2">
                    <input
                        type="text"
                        placeholder="search IRL"
                        className="rounded-2xl bg-gray-100 py-3 px-5 w-full outline-none"
                    />
                </div>
                <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition">
                    RA
                </div>
            </div>
            {/* End Header */}

            {/* Chatting Section */}
            <div className="flex flex-row justify-between bg-[#181411] h-full">

                {/* Chat List (Sidebar Izquierdo) */}
                <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto h-[calc(100vh-100px)]">

                    {/* Search Component */}
                    <div className="border-b-2 py-4 px-2">
                        <input
                            type="text"
                            placeholder="search chatting"
                            className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full outline-none focus:border-blue-400"
                        />
                    </div>

                    {/* User List */}
                    {/* Nota: En un proyecto real, esto debería ser un .map() de un array */}
                    <div className="flex flex-row py-4 px-2 justify-center items-center border-b-2 hover:bg-orange-500/20 cursor-pointer transition">
                        <div className="w-1/4">
                            <img
                                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600"
                                className="object-cover h-12 w-12 rounded-full"
                                alt="Profile"
                            />
                        </div>
                        <div className="w-full">
                            <div className="text-lg font-semibold">Luis1994</div>
                            <span className="text-gray-500">Pick me at 9:00 Am</span>
                        </div>
                    </div>

                    <div className="flex flex-row py-4 px-2 items-center border-b-2 hover:bg-orange-500/20 cursor-pointer transition">
                        <div className="w-1/4">
                            <img
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600"
                                className="object-cover h-12 w-12 rounded-full"
                                alt="Profile"
                            />
                        </div>
                        <div className="w-full">
                            <div className="text-lg font-semibold">Everest Trip 2021</div>
                            <span className="text-gray-500">Hi Sam, Welcome</span>
                        </div>
                    </div>

                    <div className="flex flex-row py-4 px-2 items-center border-b-2   bg-orange-500/20 cursor-pointer">
                        <div className="w-1/4">
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600"
                                className="object-cover h-12 w-12 rounded-full"
                                alt="Profile"
                            />
                        </div>
                        <div className="w-full">
                            <div className="text-lg font-semibold">MERN Stack</div>
                            <span className="text-gray-500">Lusi : Thanks Everyone</span>
                        </div>
                    </div>

                    <div className="flex flex-row py-4 px-2 items-center  hover:bg-orange-500/20 cursor-pointer transition">
                        <div className="w-1/4">
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"
                                className="object-cover h-12 w-12 rounded-full"
                                alt="Profile"
                            />
                        </div>
                        <div className="w-full">
                            <div className="text-lg font-semibold">Javascript Indonesia</div>
                            <span className="text-gray-500">Evan : some one can fix this</span>
                        </div>
                    </div>
                    {/* End user list */}
                </div>

                {/* Message Area (Centro) */}
                <div className="w-full px-5 flex flex-col justify-between h-[calc(100vh-100px)]">
                    <div className="flex flex-col mt-5 overflow-y-auto no-scrollbar">

                        {/* Mensaje Recibido */}
                        <div className="flex justify-end mb-4">
                            <div className="mr-2 py-3 px-4 bg-[#F57C00] rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                                Bienvenidos todos al grupo!
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600"
                                className="object-cover h-8 w-8 rounded-full"
                                alt=""
                            />
                        </div>

                        {/* Mensaje Enviado */}
                        <div className="flex justify-start mb-4">
                            <img
                                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600"
                                className="object-cover h-8 w-8 rounded-full"
                                alt=""
                            />
                            <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </div>
                        </div>

                        {/* Bloque de mensajes múltiples */}
                        <div className="flex justify-end mb-4">
                            <div>
                                <div className="mr-2 py-3 px-4 bg-[#F57C00] rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                </div>
                                <div className="mt-4 mr-2 py-3 px-4 bg-[#F57C00] rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                                    Felices vacaciones!
                                </div>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600"
                                className="object-cover h-8 w-8 rounded-full"
                                alt=""
                            />
                        </div>

                        <div className="flex justify-start mb-4">
                            <img
                                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600"
                                className="object-cover h-8 w-8 rounded-full"
                                alt=""
                            />
                            <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                                Felices Vacaciones chicos!
                            </div>
                        </div>
                    </div>

                    <div className="py-5">
                        <input
                            className="w-full bg-gray-300 py-5 px-3 rounded-xl outline-none focus:bg-gray-200 transition"
                            type="text"
                            placeholder="type your message here..."
                        />
                    </div>
                </div>


            </div>
        </div>
    );
}