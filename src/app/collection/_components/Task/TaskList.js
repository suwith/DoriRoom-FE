import TaskCard from './TaskCard';
import RegionTaskCard from './RegionTaskCard';

export default function TaskList({ type, tasks }) {
  return (
    <div className="space-y-3 max-h-screen overflow-y-auto scrollbar-hide mb-16">
      {tasks.map((task) => {
        if (type === 'general')
          return <TaskCard key={task.challengeId} {...task} />;
        else if (type === 'region')
          return <RegionTaskCard key={task.challengeId} {...task} />;
      })}
    </div>
  );
}
