import UserProfile from './_components/UserProfile';

export default function Mypage() {
  return (
    <div className="flex flex-col h-full max-w-[390px] w-screen h-screen">
      <div className="flex-2 flex items-center justify-center bg-main-5 px-4">
        <UserProfile />
      </div>
      <div className="flex-3 px-4"></div>
    </div>
  );
}
