import TaskCard from './TaskCard';

export default function TaskList({ type, regionId }) {
  // 예시 데이터
  const tasks = [
    {
      id: 1,
      title: '축제 즐겨찾기 10개 하기',
      point: 100,
      reward: 5,
      progress: 70,
      score: 7,
      complete: 10,
      status: '시작',
    },
    {
      id: 2,
      title: '일기 좋아요 10개 누르기',
      point: 100,
      reward: 10,
      progress: 70,
      score: 7,
      complete: 10,
      status: '시작',
    },
    {
      id: 3,
      title: '이웃 5명 달성하기',
      point: 200,
      reward: 10,
      progress: 0,
      score: 0,
      complete: 10,
      status: '대기',
    },
    {
      id: 4,
      title: '내 방 촬영하기 1회',
      point: 100,
      reward: 5,
      progress: 100,
      score: 1,
      complete: 1,
      status: '달성',
    },
  ];

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} {...task} />
      ))}
    </div>
  );
}
