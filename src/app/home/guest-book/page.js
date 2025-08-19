import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import GuestbookEntry from './_components/GuestbookEntry';
import BottomInputBox from './_components/BottomInputBox';
const dummyData = [
  {
    id: 1,
    username: '가나디',
    avatar: '/character.png',
    message: '방이 너무 귀여워요!\n잘 보고 갑니다 💩',
    date: '25.08.15',
  },
  {
    id: 2,
    username: '가나디',
    avatar: '/character.png',
    message:
      '방이 너무 귀여워요! 잘 보고 갑니다 💩\n방이 너무 귀여워요! 잘 보고 갑니다 💩\n방이 너무 귀여워요! 잘 보고 갑니다 💩',
    date: '25.08.15',
  },
  {
    id: 3,
    username: '가나디',
    avatar: '/character.png',
    message: '제 방도 방문해 주세요!',
    date: '25.08.15',
  },
  {
    id: 4,
    username: '가나디',
    avatar: '/character.png',
    message: '고향이 부산이신가요??\n저도 부산 출신인데 반갑네요 ㅎㅎ',
    date: '25.08.15',
  },
  {
    id: 5,
    username: '가나디',
    avatar: '/character.png',
    message: '고향이 부산이신가요??\n저도 부산 출신인데 반갑네요 ㅎㅎ',
    date: '25.08.15',
  },
  {
    id: 6,
    username: '가나디',
    avatar: '/character.png',
    message: '고향이 부산이신가요??\n저도 부산 출신인데 반갑네요 ㅎㅎ',
    date: '25.08.15',
  },
  {
    id: 7,
    username: '가나디',
    avatar: '/character.png',
    message: '고향이 부산이신가요??\n저도 부산 출신인데 반갑네요 ㅎㅎ',
    date: '25.08.15',
  },
];

export default function GuestBookPage() {
  return (
    <div className="max-w-[390px] w-screen h-screen bg-[#F7F7F7]">
      <HeaderNavigationBar title="방명록" />
      <div className="h-[calc(100vh-98px)] pt-[98px] pb-2 space-y-5 bg-[#F7F7F7] overflow-y-auto">
        {dummyData.map((data) => (
          <GuestbookEntry key={data.id} data={data} />
        ))}
      </div>
      <BottomInputBox
        classname={
          'fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] px-4 py-[10px] mb-[34px]'
        }
      />
    </div>
  );
}
