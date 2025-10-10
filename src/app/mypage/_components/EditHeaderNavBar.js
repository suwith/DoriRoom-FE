'use client';

export default function EditHeaderNavBar({
  title = '제목 없음',
  className = '',
  onClick,
}) {
  return (
    <header
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-screen header-padding-t ${className}`}
    >
      <div className="relative flex items-center justify-center mx-auto">
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

        <div
          className="absolute left-4 font-normal font-sm text-neutral-400"
          onClick={() => history.back()}
        >
          취소
        </div>
        <div
          className="absolute right-4 font-normal font-sm text-main-100"
          onClick={onClick}
        >
          확인
        </div>
      </div>
    </header>
  );
}
