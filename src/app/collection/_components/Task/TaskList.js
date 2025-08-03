import TaskCard from './TaskCard';
import ResionTaskCard from './ResionTaskCard';

export default function TaskList({ type, regionId, tasks }) {
  return (
    <div className="space-y-3 mb-16">
      {tasks.map((task) => {
        if (type === 'general') return <TaskCard key={task.id} {...task} />;
        else if (type === 'resion')
          return <ResionTaskCard key={task.id} {...task} />;
      })}
    </div>
  );
}
