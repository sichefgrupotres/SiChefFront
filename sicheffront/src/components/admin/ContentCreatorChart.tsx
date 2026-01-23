"use client";

import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PostData {
  date: string; // fecha del post, ej: "2026-01-22"
  count: number; // cantidad de posts ese día
}

interface UserPosts {
  id: string; // id único del creador
  username: string;
  posts?: PostData[];
}

interface Props {
  token: string;
}

export default function CreatorsActivityChart({ token }: Props) {
  const [data, setData] = useState<UserPosts[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  // Fetch de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users-posts`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) throw new Error("Error al cargar datos");

        const json: UserPosts[] = await res.json();
        setData(json);
        setSelectedCreators(json.map((c) => c.username)); // todos seleccionados por defecto
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Filtrado por búsqueda y eliminación de duplicados
  const filteredCreators = useMemo(() => {
    const map = new Map<string, UserPosts>();
    data.forEach((c) => {
      if (
        c.username.toLowerCase().includes(search.toLowerCase()) &&
        !map.has(c.username)
      ) {
        map.set(c.username, c);
      }
    });
    return Array.from(map.values());
  }, [data, search]);

  // Construimos chartData: cada fila = fecha, cada columna = cantidad posts por creador
  const chartData = useMemo(() => {
    if (!data.length) return [];

    const allDates = Array.from(
      new Set(data.flatMap((c) => (c.posts || []).map((p) => p.date))),
    ).sort();

    return allDates.map((date) => {
      const row: Record<string, string | number> = { date };
      filteredCreators.forEach((creator) => {
        if (!selectedCreators.includes(creator.username)) return;
        const post = (creator.posts || []).find((p) => p.date === date);
        row[creator.username] = post ? post.count : 0;
      });
      return row;
    });
  }, [filteredCreators, selectedCreators]);

  const colors = [
    "#F57C00",
    "#FFB74D",
    "#FF9800",
    "#FFA726",
    "#FB8C00",
    "#EF6C00",
    "#FF6D00",
    "#FF8F00",
    "#E65100",
    "#BF360C",
  ];

  const toggleCreator = (username: string) => {
    setSelectedCreators((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username],
    );
  };

  if (loading)
    return <div className="text-white/50">Cargando estadísticas...</div>;
  if (!data.length)
    return (
      <div className="text-white/50">No hay actividad de creadores aún.</div>
    );

  return (
    <section className="bg-[#2a221b] rounded-2xl p-6 border border-white/10 shadow-xl">
      {/* BUSCADOR Y SELECCIÓN */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Buscar creador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[#1f1a15] text-white border border-white/20 focus:outline-none"
        />

        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
          {filteredCreators.map((creator, index) => {
            const uniqueKey = `${creator.username}-${index}`;
            const isSelected = selectedCreators.includes(creator.username);

            return (
              <button
                key={uniqueKey}
                onClick={() => toggleCreator(creator.username)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition ${
                  isSelected
                    ? "bg-orange-600 text-white"
                    : "bg-white/20 text-white/80"
                }`}
              >
                {creator.username}
              </button>
            );
          })}
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="date"
              tick={{ fill: "#FFB74D", fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "#FFF" }}
            />
            <YAxis
              tick={{ fill: "#FFF", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#FFF" }}
              allowDecimals={false} // solo enteros
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#2a221b", border: "none" }}
              labelStyle={{ color: "#FFB74D", fontWeight: 600 }}
              itemStyle={{ color: "#FFF" }}
              formatter={(value, name) => {
                const count = value ?? 0; // si es undefined, ponemos 0
                return [`${count} posts`, name];
              }}
            />
            <Legend
              wrapperStyle={{ color: "#FFF", fontSize: 10 }}
              layout="horizontal"
              verticalAlign="top"
            />

            {filteredCreators.map((creator, index) =>
              selectedCreators.includes(creator.username) ? (
                <Line
                  key={`${creator.username}-${index}`}
                  type="monotone"
                  dataKey={creator.username}
                  stroke={colors[index % colors.length]}
                  strokeWidth={1}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ) : null,
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
