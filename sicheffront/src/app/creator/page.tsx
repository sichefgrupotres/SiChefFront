import Link from "next/link"

export default function CreatorPage() {
    return (
        <div className="flex flex-col gap-6 p-4 pb-28">
            {/* Overview */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Overview</h2>

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#2A2622] rounded-xl p-4">
                        <p className="text-sm text-white/60">Views</p>
                        <p className="text-xl font-semibold">12.5k</p>
                    </div>

                    <div className="bg-[#2A2622] rounded-xl p-4">
                        <p className="text-sm text-white/60">Followers</p>
                        <p className="text-xl font-semibold">850</p>
                    </div>

                    <div className="bg-[#2A2622] rounded-xl p-4">
                        <p className="text-sm text-white/60">Rating</p>
                        <p className="text-xl font-semibold">4.8</p>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="flex gap-3">

                <Link
                    href="/creator/recipes/new"
                    className="flex flex-col items-center justify-center flex-1 gap-1 h-20 rounded-xl py-3 bg-primary text-white font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                >
                    <span className="material-symbols-outlined text-[28px]">
                        restaurant_menu
                    </span>
                    <span className="font-semibold">New Recipe</span>
                </Link>

                <button className="flex-1 bg-[#2A2622] rounded-xl py-3 font-semibold flex items-center justify-center">
                    🎥 New Tutorial
                </button>

            </section>


            {/* Performance */}
            <section className="bg-[#2A2622] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Performance (30 Days)</h3>
                    <span className="text-green-400 text-sm">+12%</span>
                </div>

                <div className="h-32 bg-[#1E1B18] rounded-lg flex items-center justify-center text-white/40">
                    Chart placeholder
                </div>
            </section>

            {/* Recent Drafts */}
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Recent Drafts</h3>
                    <button className="text-orange-500 text-sm">Manage All</button>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="bg-[#2A2622] rounded-xl p-3 flex justify-between items-center">
                        <div>
                            <p className="font-medium">Summer Quinoa Salad</p>
                            <p className="text-sm text-white/50">Edited 2h ago</p>
                        </div>
                        <button>✏️</button>
                    </div>

                    <div className="bg-[#2A2622] rounded-xl p-3 flex justify-between items-center">
                        <div>
                            <p className="font-medium">Basic Sourdough Tutorial</p>
                            <p className="text-sm text-white/50">Edited yesterday</p>
                        </div>
                        <button>✏️</button>
                    </div>
                </div>
            </section>

            {/* Inbox */}
            <section>
                <h3 className="font-semibold mb-3">Inbox</h3>

                <div className="bg-[#2A2622] rounded-xl p-4 flex justify-between items-center">
                    <div>
                        <p className="font-medium">New message</p>
                        <p className="text-sm text-white/50">
                            You have unread messages
                        </p>
                    </div>

                    <span className="bg-orange-500 text-xs px-2 py-1 rounded-full">
                        3 New
                    </span>
                </div>
            </section>
        </div>
    );
}
