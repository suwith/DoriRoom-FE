'use client';

import { FadeLoader } from 'react-spinners';

export default function LoadingContent({ loading, className }) {
  if (!loading) return null;

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center ${className}`}
    >
      <FadeLoader color="#35C284" />
    </div>
  );
}
