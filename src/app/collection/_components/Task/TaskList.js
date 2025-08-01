import TaskCard from './TaskCard';

export default function TaskList({ type, regionId, tasks }) {
  return (
    <div className="space-y-3 mb-16">
      {tasks.map((task) => (
        <TaskCard key={task.id} {...task} />
      ))}
    </div>
  );
}
