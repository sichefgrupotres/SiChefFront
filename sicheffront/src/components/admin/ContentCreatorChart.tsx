"use client";

import { useEffect, useState } from "react";

interface UserPosts {
  username: string;
  postsCount: number;
}

export default function UsersPostsChart({ token }: { token: string }) {
  const [data, setData] = useState<UserPosts[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users-posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al cargar datos");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setData([]);
      }
    };

    fetchData();
  }, [token]);

  return (
    <section className="bg-[#2a221b] rounded-xl p-6 border border-white/10 shadow-lg">
      <div className="flex justify-between mb-4">
        <div>
          <p className="font-semibold text-white text-lg">Productividad de Creadores</p>
          <p className="text-sm text-white/50">Usuarios y cantidad de posts</p>
        </div>
      </div>

      <div className="h-48 flex items-end gap-4 overflow-x-auto pb-4">
        {data.length === 0 ? (
          <p className="text-white/50">Cargando...</p>
        ) : (
          data.map((d) => {
            const height = Math.max(d.postsCount * 10, 10); // mínimo 10px para visibilidad
            return (
              <div key={d.username} className="flex flex-col items-center min-w-[40px]">
                <div
                  className="w-8 rounded-t-lg bg-gradient-to-t from-orange-500 to-yellow-400 transition-all duration-300"
                  style={{ height: `${height}px` }}
                />
                <span className="text-xs mt-1 text-white truncate max-w-[50px] text-center">
                  {d.username}
                </span>
                <span className="text-xs mt-1 text-white/70">{d.postsCount}</span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}




