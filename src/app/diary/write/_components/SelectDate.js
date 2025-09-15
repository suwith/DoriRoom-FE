'use client';

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import React from 'react';
import { useToast } from '@/app/_providers/ToastProvider';

export default function SelectDate({ selectedDate, onSelect, onClose }) {
  const today = new Date();

  const { show } = useToast();
  return (
    <div
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] mx-auto z-100 bg-background rounded-t-xl px-4 py-4`}
    >
      <div className="w-full text-right mb-1">
        <button
          onClick={onClose}
          className="bg-main-5 text-main-100 rounded-full w-5 h-5 p-1 text-xs"
        >
          <i className="mgc_close_line" />
        </button>
      </div>

      <div className="w-full max-w-sm px-4 flex justify-center items-center mb-3 ">
        <DayPicker
          selectedDays={selectedDate}
          disabledDays={{ after: new Date(today.setHours(0, 0, 0, 0) - 1) }}
          onDayClick={(date, modifiers) => {
            if (modifiers.disabled) {
              show({
                message: '오늘 이후 날짜는 선택할 수 없습니다.',
                variant: 'error',
              });
              return;
            }
            onSelect(date);
          }}
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
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '32px',
              textAlign: 'center',
              backgroundColor: isSelected ? '#35C284' : '#F7F7F7',
              color: isSelected ? '#FEFEFE' : '#737373',
              paddingTop: '3px',
            };

            return <div style={style}>{date.getDate()}</div>;
          }}
        />
      </div>

      <button
        onClick={onClose}
        className="w-full py-2 bg-main-100 text-background rounded-lg text-sm font-medium shadow-md"
        style={{ boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex items-center justify-center">
          <span className="text-lg">날짜 선택 완료</span>
        </div>
      </button>
    </div>
  );
}
