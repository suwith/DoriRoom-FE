'use client';

export default function SearchBar({ query, setQuery }) {
  return (
    <div className="flex items-center gap-2 mb-4 bg-white rounded-lg px-3 py-2 shadow">
      <i className="mgc_search_2_fill w-5 h-5 text-gray-500" />
      <input
        type="text"
        placeholder="닉네임 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 outline-none text-sm"
      />
    </div>
  );
}
