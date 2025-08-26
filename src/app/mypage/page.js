import UserProfile from './_components/UserProfile';
import Link from 'next/link';

export default function Mypage() {
  return (
    <div className="flex flex-col h-full max-w-[390px] w-screen h-screen">
      <div className="flex-2 flex items-center justify-center bg-main-5 px-4">
        <UserProfile />
      </div>
      <div className="flex-3 flex flex-col divide-y-2 divide-neutral-100">
        <IconButton
          icon={<i className="mgc_pin_fill text-main-100 text-xl" />}
          label="공지사항"
          textColor="text-neutral-900"
        />
        <IconButton
          icon={<i className="mgc_pen_fill text-main-100 text-xl" />}
          label="이용약관"
          textColor="text-neutral-900"
        />
        <IconButton
          icon={<i className="mgc_entrance_fill text-main-100 text-xl" />}
          label="로그아웃"
          textColor="text-neutral-900"
        />
        <IconButton
          icon={<i className="mgc_delete_2_fill text-main-100 text-xl" />}
          label="탈퇴하기"
          textColor="text-neutral-900"
        />
      </div>
    </div>
  );
}

function IconButton({ icon, label, href = '/', textColor }) {
  return (
    <Link href={href}>
      <div className="flex items-center space-x-2 py-3 px-4">
        {icon}
        <span className={`text-sm font-normal ${textColor}`}>{label}</span>
      </div>
    </Link>
  );
}
