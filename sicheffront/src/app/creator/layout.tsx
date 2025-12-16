import Image from "next/image";
import NavBarCreator from "../../components/NavBars/NavBarCreator";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#3D2B1F]  text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center">
            <Image
              src="/chef-avatar.jpg"
              alt="Chef Avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm text-white/60">Panel</p>
            <h1 className="font-semibold">Chef Marco</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="opacity-70 hover:opacity-100">🔔</button>
          <button className="opacity-70 hover:opacity-100">⚙️</button>
        </div>
      </header>

      {/* Page content */}
      <div className="flex min-h-screen">
        <NavBarCreator />
        <main className="flex-1 p-4 pb-28 ">
          {children}
        </main>
      </div>
    </div>
  );
}
