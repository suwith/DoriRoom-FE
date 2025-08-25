import { FaFire } from 'react-icons/fa6';

export default function Item({
  name = '장미 머리띠',
  price = null,
  onClick,
  isSelected,
  Icon = null,
  imageUrl,
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={onClick}
        className={`relative rounded-md w-[110px] h-[126px]  ${!isSelected ? 'bg-neutral-100 ring-1 ring-neutral-300/50' : 'bg-main-5 ring-1 ring-main-40'}`}
      >
        {Icon === null ? (
          <img
            src={imageUrl}
            className="absolute top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black w-12 h-12"
          />
        ) : (
          <Icon
            className={`absolute top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 ${isSelected ? 'text-main-40' : 'text-neutral-300'}`}
          />
        )}
        <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 -translate-y-1/2 bg-background w-[100px] h-[23px] rounded-lg flex justify-center items-center">
          <p className="text-center text-black font-semibold text-[13px]">
            {name}
          </p>
        </div>
      </div>
      {price !== null && (
        <div className="flex items-center justify-center gap-1 rounded-md w-[110px] h-[20px] ring-1 ring-neutral-300/50 text-main-100">
          <FaFire className="trnsform scale-x-[-1] text-main-100 w-3.5 h-3.5" />
          <p className="text-center font-bold text-sm">{price}</p>
        </div>
      )}
    </div>
  );
}
