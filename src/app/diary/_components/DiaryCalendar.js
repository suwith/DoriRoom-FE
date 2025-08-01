'use client';

import React, { useMemo, useState } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { ko } from 'date-fns/locale';
import { mockDiaries } from '../mockData.js';
import { format, parse } from 'date-fns';

export default function DiaryCalendar({ onDateClick }) {
  const diaryMap = useMemo(() => {
    const map = {};
    mockDiaries.forEach((d) => {
      if (!map[d.date]) map[d.date] = [];
      map[d.date].push(d);
    });
    return map;
  }, []);

  const diaryWithImage = mockDiaries
    .filter((d) => d.images?.length > 0)
    .map((d) => parse(d.date, 'yyyy.MM.dd', new Date()));

  const diaryWithoutImage = mockDiaries
    .filter((d) => !d.images?.length && !d.disabled)
    .map((d) => parse(d.date, 'yyyy.MM.dd', new Date()));

  const disabledDays = mockDiaries
    .filter((d) => d.disabled)
    .map((d) => parse(d.date, 'yyyy.MM.dd', new Date()));

  const [month, setMonth] = useState(new Date());

  return (
    <div className="w-full max-w-sm mx-auto flex justify-center items-center">
      <DayPicker
        locale={ko}
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
        onDayClick={(date) => {
          const iso = date.toISOString().split('T')[0];
          if (diaryMap[iso]?.some((d) => d.disabled)) return;
          onDateClick?.(iso);
        }}
        selectedDays={[]} // 제어 컴포넌트에서 상태로 조절 가능
        disabledDays={disabledDays}
        modifiers={{
          today: new Date(),
          diaryWithImage,
          diaryWithoutImage,
        }}
        renderDay={(date) => {
          const iso = format(date, 'yyyy.MM.dd');
          const isToday = new Date().toDateString() === date.toDateString();
          const diary = diaryMap[iso]?.[0];
          const isDisabled = diary?.disabled;

          // 기본 스타일
          const style = {
            width: '39px',
            height: '39px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '32px',
            textAlign: 'center',
            backgroundColor: '#F7F7F7', // neutral-100
            color: '#737373', // neutral-500
            paddingTop: '4px',
          };

          //썸네일 있는 일기가 있을 떄
          if (diary?.images?.length > 0) {
            style.backgroundImage = `url(${diary.images[0]})`;
            style.backgroundSize = 'cover';
            style.backgroundPosition = 'center';
            style.color = '#FFFFFF';
          }
          //썸네일 없는 일기가 있을 떄
          else if (diary && !diary.images?.length) {
            style.backgroundColor = '#35C284'; // main-100
            style.color = '#FEFEFE';
          }

          //오늘
          if (isToday) {
            style.backgroundColor = '#F4FBF8'; // main-5
            style.color = '#35C284'; // main-100
          }

          //일정 없는 날
          if (isDisabled) {
            style.backgroundColor = '#E5E7EB';
            style.color = '#A3A3A3';
            style.textDecoration = 'line-through';
            style.pointerEvents = 'none';
          }

          return (
            <div>
              <div style={style}>{date.getDate()}</div>
            </div>
          );
        }}
      />
    </div>
  );
}
