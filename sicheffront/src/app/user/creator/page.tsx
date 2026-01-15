import React from 'react';

export default function CreatorProfile() {
    return (
        <div className="min-h-screen bg-[#181411] text-[#e6e0db] font-sans selection:bg-[#F57C00]/30">
            {/* Import de Iconos */}
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />

            {/* Header con el tono de elevación #2a221b */}
            <header className="sticky top-0 z-50 w-full bg-[#181411]/90 backdrop-blur-xl border-b border-[#e6e0db]/10">
                <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
                    <button className="group flex items-center gap-2 text-[#e6e0db] hover:text-[#F57C00] transition-all cursor-pointer">
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                        <span className="hidden sm:inline font-medium">Volver</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 rounded-xl bg-[#181411] border border-[#e6e0db]/5 hover:border-[#F57C00]/50 transition-colors">
                            <span className="material-symbols-outlined">share</span>
                        </button>
                        <button className="flex items-center gap-2 bg-[#F57C00] text-[#181411] px-6 py-2.5 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#F57C00]/20 cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">send</span>
                            <span>Mensaje</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* COLUMNA IZQUIERDA: Profile Card */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-28 flex flex-col items-center lg:items-start">
                            <div className="relative mb-8">
                                <div
                                    className="h-44 w-44 rounded-[2.5rem]  shadow-2xl bg-cover bg-center ring-4 ring-[#2a221b] outline outline-1 outline-[#F57C00]/30"
                                    style={{ backgroundImage: `url('https://www.shutterstock.com/image-photo/restaurant-kitchen-portrait-confident-chef-600nw-2645077225.jpg')` }}
                                />
                            </div>

                            <h1 className="text-4xl font-black text-[#e6e0db] mb-2 tracking-tight">Chef Juan</h1>
                            <p className="text-[#e6e0db]/60 text-lg mb-8 leading-relaxed max-w-sm">
                                Especialista en técnica <span className="text-[#F57C00]">slow-food</span> y pastas artesanales.
                            </p>

                            {/* Stats box con contraste sutil */}
                            <div className="grid grid-cols-3 gap-1 w-full bg-[#2a221b] p-1 rounded-3xl border border-[#e6e0db]/5 mb-8">
                                <StatItem value="12.5k" label="Seguidores" />
                                <StatItem value="45" label="Platos" />
                                <StatItem value="4.9" label="⭐" />
                            </div>

                            <div className="flex flex-col w-full gap-4">
                                <button className="w-full h-14 rounded-2xl border-2 border-[#F57C00] text-[#F57C00] font-bold flex items-center justify-center gap-2 hover:bg-[#F57C00]/10 transition-colors cursor-pointer">
                                    Seguir Chef
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* COLUMNA DERECHA: Feed */}
                    <section className="lg:w-2/3">
                        {/* Custom Tabs */}
                        <div className="flex gap-2 p-1.5 bg-[#2a221b] rounded-2xl mb-10 w-fit">
                            <button className="px-8 py-3 rounded-xl bg-[#F57C00] text-[#e6e0db] font-bold shadow-lg cursor-pointer">Recetas</button>
                            <button className="px-8 py-3 rounded-xl text-[#e6e0db]/50 font-bold hover:text-[#e6e0db] transition-colors cursor-pointer">Tutoriales</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 cursor-pointer">
                            <RecipeCard
                                title="Ensalada Tropical"
                                time="45 min"
                                level="Fácil"
                                img="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
                            />
                            <RecipeCard
                                title="Pesto Genovese"
                                time="15 min"
                                level="Pro"
                                img="https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400"
                            />

                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

function StatItem({ value, label }) {
    return (
        <div className="text-center py-4 rounded-2xl hover:bg-[#181411]/40 transition-colors">
            <p className="text-xl font-black text-[#F57C00]">{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#e6e0db]/40">{label}</p>
        </div>
    );
}

function RecipeCard({ title, time, level, img }) {
    return (
        <div className="group bg-[#2a221b] rounded-[2rem] overflow-hidden border border-[#e6e0db]/5 hover:border-[#F57C00]/30 transition-all duration-500">
            <div className="relative aspect-[4/5] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url('${img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-transparent opacity-80" />

                {/* Badge flotante */}
                <div className="absolute top-4 left-4 bg-[#181411]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#e6e0db]/10">
                    <span className="text-[10px] font-bold text-[#F57C00] tracking-widest uppercase">{level}</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 text-[#e6e0db]/70 text-xs font-bold mb-2 uppercase tracking-tighter">
                        <span className="material-symbols-outlined text-sm text-[#F57C00]">schedule</span>
                        {time}
                    </div>
                    <h3 className="text-xl font-bold text-[#e6e0db] leading-tight group-hover:text-[#F57C00] transition-colors">
                        {title}
                    </h3>
                </div>
            </div>
        </div>
    );
}