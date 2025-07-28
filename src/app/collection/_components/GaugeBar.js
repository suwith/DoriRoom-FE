export default function GaugeBar({ value, max = 100 }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full bg-main-5 rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-main-100 transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
