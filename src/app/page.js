import HeaderBar from './home/Header';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <HeaderBar />

      <div className="h-full flex justify-center items-center p-4">
        <Image src="/character.png" alt="character" />
      </div>
    </>
  );
}
