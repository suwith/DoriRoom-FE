'use client';

export default function BackButton() {
  return (
    <button
      onClick={() => history.back()}
      className="text-neutral-500 cursor-pointer flex items-center gap-1"
    >
      <i className="mgc_left_line text-3xl" />
    </button>
  );
}
