import HeaderBar from './home/Header';

export default function Home() {
  return (
    <>
      <HeaderBar />

      <div className="h-full flex justify-center items-center p-4">
        <p className="text-main">캐릭터 위치</p>
      </div>
    </>
  );
}
