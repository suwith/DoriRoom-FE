import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { MdEditSquare } from 'react-icons/md';

export default function Myinfo() {
  return (
    <div className="flex flex-col h-full max-w-[390px] w-screen h-screen">
      <HeaderNavigationBar title="내 정보" />
      <div className="flex-2 flex items-end justify-center bg-main-5 px-4">
        <div className="relative mb-12">
          <img
            src="/character.png"
            alt="profile_image"
            className="rounded-full w-30 h-30"
          />
          <button
            className="absolute -bottom-1 -right-1 rounded-full p-2 bg-neutral-100"
            style={{ boxShadow: '0 0 3px rgba(0,0,0,0.2)' }}
          >
            <MdEditSquare className="text-neutral-400 text-base" />
          </button>
        </div>
      </div>
      <div className="flex-3 flex flex-col divide-y-2 divide-neutral-100">
        <IconButton title="닉네임" label="가나디" showEditBtn={true} />
        <IconButton title="아이디" label="yeonn4" />
        <IconButton title="이메일" label="daf@naver.com" />
        <IconButton title="비밀번호" showEditBtn={true} />
      </div>
    </div>
  );
}

function IconButton({ title, label = '', showEditBtn = false }) {
  return (
    <div className="flex items-center space-x-5 py-3 px-4 text-sm">
      <span className="font-semibold">{title}</span>
      {label.length > 0 && <span className="font-normal">{label}</span>}
      {showEditBtn && (
        <button className="bg-main-100 rounded-lg px-2 py-1 text-background">
          <p>변경</p>
        </button>
      )}
    </div>
  );
}
