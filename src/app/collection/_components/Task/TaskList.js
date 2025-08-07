import TaskCard from './TaskCard';
import RegionTaskCard from './RegionTaskCard';

export default function TaskList({ type, regionId, tasks }) {
  return (
    <div className="space-y-3 max-h-screen overflow-y-auto scrollbar-hide mb-16">
      {tasks.map((task) => {
        if (type === 'general') return <TaskCard key={task.id} {...task} />;
        else if (type === 'region')
          return <RegionTaskCard key={task.id} {...task} />;
      })}
    </div>
  );
}
