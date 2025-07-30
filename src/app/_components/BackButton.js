'use client';

export default function BackButton({
  color = 'text-neutral-500',
  isShadow = false,
}) {
  return (
    <button
      onClick={() => history.back()}
      className={`cursor-pointer flex items-center gap-1 ${color}`}
    >
      <i
        className={`mgc_left_line text-3xl ${isShadow ? 'drop-shadow' : ''}`}
      />
    </button>
  );
}
