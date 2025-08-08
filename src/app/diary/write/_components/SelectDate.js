'use client';

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

export default function SelectDate({ selectedDate, onSelect, onClose }) {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] mx-auto pb-16 z-100 rounded-t-xl px-4 pt-4 bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ">
      <div className="w-full text-right mb-1">
        <button
          onClick={onClose}
          className=" bg-main-5 bg-opacity-50 text-main-40 rounded-full w-5 h-5 text-xs"
        >
          ✕
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto flex justify-center items-center mb-3">
        <DayPicker
          selectedDays={selectedDate}
          onDayClick={(date) => onSelect(date)}
          months={[
            '1월',
            '2월',
            '3월',
            '4월',
            '5월',
            '6월',
            '7월',
            '8월',
            '9월',
            '10월',
            '11월',
            '12월',
          ]}
          weekdaysShort={['일', '월', '화', '수', '목', '금', '토']}
          firstDayOfWeek={1}
          renderDay={(date) => {
            const isSelected =
              selectedDate &&
              new Date(selectedDate).toDateString() === date.toDateString();

            const style = {
              width: '39px',
              height: '39px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '32px',
              textAlign: 'center',
              backgroundColor: isSelected ? '#35C284' : '#F7F7F7',
              color: isSelected ? '#FEFEFE' : '#737373',
              paddingTop: '4px',
            };

            return <div style={style}>{date.getDate()}</div>;
          }}
        />
      </div>

      <div
        className="bg-white rounded-xl py-1"
        style={{ boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)' }}
      >
        <button
          onClick={onClose}
          className="fixed bottom-7 left-1/2 -translate-x-1/2 w-[350px] py-2 bg-main-100 text-background rounded-lg text-sm font-medium shadow-md"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">날짜 선택 완료</span>
          </div>
        </button>
      </div>
    </div>
  );
}
