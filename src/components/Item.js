import { GiShirt } from 'react-icons/gi';
import { FaLeaf } from 'react-icons/fa';

export default function Item({
  name = '장미 머리띠',
  price = 8,
  onClick,
  isSelected,
  icon: Icon = GiShirt,
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={onClick}
        className={`relative rounded-md w-[110px] h-[126px]  ${!isSelected ? 'bg-neutral-100 ring-1 ring-neutral-300/30' : 'bg-emerald-100/30 ring-1 ring-emerald-300/30'}`}
      >
        <Icon className="absolute top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black w-12 h-12" />
        <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[100px] h-[23px] rounded-lg flex justify-center items-center">
          <p className="text-center text-black font-semibold text-[13px]">
            {name}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 rounded-md w-[110px] h-[20px] ring-1 ring-neutral-300/30 text-emerald-400">
        <FaLeaf className="" />
        <p className="text-center font-bold text-[13px]">{price}</p>
      </div>
    </div>
  );
}
