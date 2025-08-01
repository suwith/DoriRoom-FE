export default function NameCircle({ name, color }) {
  return (
    <g transform="translate(80, 180) scale(2.5)">
      <rect
        x={-19.8}
        y={-7.5}
        width={40}
        height={14}
        rx={6}
        fill="white"
        stroke={color}
        strokeWidth={0.1}
      />

      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8"
        fontWeight="bold"
        fill={color}
      >
        {name}
      </text>
    </g>
  );
}
