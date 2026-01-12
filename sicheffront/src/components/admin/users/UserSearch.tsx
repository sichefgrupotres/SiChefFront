"use client";

interface UserSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e?: React.FormEvent) => void;
}

export default function UserSearch({ value, onChange, onSubmit }: UserSearchProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-2xl shadow-lg rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 mb-4"
    >
      <div className="flex items-center gap-2 w-full px-4 py-3 bg-white">
        <span className="material-symbols-outlined text-gray-400">
          search
        </span>
        <input
          type="text"
          placeholder="Buscar usuario por email"
          className="w-full outline-none text-base text-gray-700 placeholder-gray-400"
          value={value}
          onChange={onChange}
        />
      </div>

      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 font-bold transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
