import HeaderBar from './home/Header';

export default function Home() {
  return (
    <>
      <HeaderBar />

      <div className="h-full flex justify-center items-center p-4 max-w-[390px] w-screen">
        <p className="text-main">캐릭터 위치</p>
      </div>
    </>
  );
}
