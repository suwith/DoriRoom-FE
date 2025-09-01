'use client';

import BottomSheet from './BottomSheet';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/app/_providers/ToastProvider';

// options: [{ groupName, areaGroupCode, areaCode, areaName, sigunguCode, sigunguName }]
export default function RegionFilter({
  open,
  onClose,
  value = [],
  onChange,
  options = [],
}) {
  const [temp, setTemp] = useState(value);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { show } = useToast();
  const MAX = 10;

  const [overLimit, setOverLimit] = useState(false);

  useEffect(() => {
    if (overLimit) {
      show(`선택은 최대 ${MAX}개까지 가능합니다.`);
      setOverLimit(false);
    }
  }, [overLimit, show]);

  // 그룹 → 시도 → 시군구 구조 변환
  const byGroup = useMemo(() => {
    const map = {};
    for (const it of options) {
      if (!map[it.areaGroupCode]) {
        map[it.areaGroupCode] = { groupName: it.groupName, sidos: {} };
      }
      if (!map[it.areaGroupCode].sidos[it.areaCode]) {
        map[it.areaGroupCode].sidos[it.areaCode] = {
          areaName: it.areaName,
          sigungus: [],
        };
      }
      if (it.sigunguName) {
        map[it.areaGroupCode].sidos[it.areaCode].sigungus.push({
          code: it.sigunguCode,
          name: it.sigunguName,
        });
      }
    }
    return map;
  }, [options]);

  const groupList = useMemo(
    () =>
      Object.entries(byGroup).map(([code, obj]) => ({
        areaGroupCode: Number(code),
        name: obj.groupName,
      })),
    [byGroup]
  );

  useEffect(() => {
    if (open) {
      setTemp(value);
      setSelectedGroup((prev) => prev || groupList[0]?.areaGroupCode || null);
    }
  }, [open, value, groupList]);

  const isSelected = (group, areaCode, sigunguCode) =>
    temp.some(
      (x) =>
        x.areaGroupCode === group &&
        x.areaCode === areaCode &&
        x.sigunguCode === sigunguCode
    );

  const removeChip = (target) => {
    setTemp((prev) =>
      prev.filter(
        (x) =>
          !(
            x.areaGroupCode === target.areaGroupCode &&
            x.areaCode === target.areaCode &&
            x.sigunguCode === target.sigunguCode
          )
      )
    );
  };

  const prettyChip = (sel) => {
    if (sel.areaCode === 0) {
      const groupObj = byGroup[sel.areaGroupCode];
      return groupObj ? `${groupObj.groupName} 전체` : '';
    }
    const groupObj = byGroup[sel.areaGroupCode];
    const sidoObj = groupObj?.sidos[sel.areaCode];
    if (!sidoObj) return '';
    if (sel.sigunguCode === null) return `${sidoObj.areaName} 전체`;
    const sigungu = sidoObj.sigungus.find((s) => s.code === sel.sigunguCode);
    return `${sidoObj.areaName} ${sigungu?.name ?? ''}`;
  };

  // 도 전체 토글
  const toggleGroupAll = (groupCode) => {
    setTemp((prev) => {
      const exists = isSelected(groupCode, 0, null);
      if (exists) {
        return prev.filter(
          (x) => !(x.areaGroupCode === groupCode && x.areaCode === 0)
        );
      }
      const cleared = prev.filter((x) => x.areaGroupCode !== groupCode);
      if (cleared.length + 1 > MAX) {
        setOverLimit(true);
        return prev;
      }
      return [
        ...cleared,
        { areaGroupCode: groupCode, areaCode: 0, sigunguCode: null },
      ];
    });
  };

  // 시/도 전체 or 시군구 토글
  const toggle = (groupCode, areaCode, sigunguCode) => {
    setTemp((prev) => {
      const exists = isSelected(groupCode, areaCode, sigunguCode);
      if (exists) {
        return prev.filter(
          (x) =>
            !(
              x.areaGroupCode === groupCode &&
              x.areaCode === areaCode &&
              x.sigunguCode === sigunguCode
            )
        );
      }

      if (sigunguCode === null) {
        // 시/도 전체 선택 → 해당 시도의 모든 선택 제거 후 전체만 추가
        const cleared = prev.filter(
          (x) => !(x.areaGroupCode === groupCode && x.areaCode === areaCode)
        );
        if (cleared.length + 1 > MAX) {
          setOverLimit(true);
          return prev;
        }
        return [
          ...cleared,
          { areaGroupCode: groupCode, areaCode, sigunguCode: null },
        ];
      }
      // 개별 시군구 선택 → 같은 시도의 전체 + 같은 그룹의 도 전체 제거
      const cleared = prev.filter(
        (x) =>
          !(
            (x.areaGroupCode === groupCode &&
              x.areaCode === areaCode &&
              x.sigunguCode === null) ||
            (x.areaGroupCode === groupCode &&
              x.areaCode === 0 &&
              x.sigunguCode === null)
          )
      );

      if (cleared.length >= MAX) {
        setOverLimit(true);
        return prev;
      }

      return [...cleared, { areaGroupCode: groupCode, areaCode, sigunguCode }];
    });
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="지역"
      footer={
        <div className="flex items-center gap-2 pb-3 px-4">
          <button
            type="button"
            className="px-4 py-3 rounded-md bg-main-15 text-main-100 font-semibold shrink-0"
            onClick={() => setTemp([])}
          >
            초기화
          </button>
          <button
            type="button"
            className="flex-1 py-3 rounded-md bg-main-100 text-white font-semibold"
            onClick={() => {
              onChange(temp);
              onClose();
            }}
          >
            총 {temp.length}개 결과 보기
          </button>
        </div>
      }
    >
      {/* 상단 탭 */}
      <div className="grid grid-cols-2">
        <div className="text-center py-2 text-neutral-600 border-b border-neutral-100">
          시/도
        </div>
        <div className="text-center py-2 text-neutral-600 border-b border-neutral-100">
          시/군/구
        </div>
      </div>

      <div className="grid grid-cols-2 min-h-[340px]">
        {/* 좌측: 도 그룹 */}
        <div className="overflow-hidden">
          <ul className="max-h-[340px] overflow-y-auto scrollbar-hide">
            {groupList.map((g) => {
              const active = selectedGroup === g.areaGroupCode;
              return (
                <li key={g.areaGroupCode}>
                  <button
                    type="button"
                    onClick={() => setSelectedGroup(g.areaGroupCode)}
                    className={[
                      'w-full px-4 h-10 text-sm text-center',
                      active
                        ? 'bg-main-5 text-main-100'
                        : 'bg-neutral-100 text-neutral-500',
                    ].join(' ')}
                  >
                    {g.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 우측: 시도 + 시군구 */}
        <div className="max-h-[340px] overflow-y-auto scrollbar-hide">
          {selectedGroup && (
            <>
              {/* 도 전체 (시도가 2개 이상일 때만) */}
              {Object.keys(byGroup[selectedGroup].sidos).length > 1 && (
                <div className="border-b border-neutral-100">
                  <button
                    type="button"
                    onClick={() => toggleGroupAll(selectedGroup)}
                    className="w-full px-4 h-10 flex items-center justify-between"
                  >
                    <span
                      className={`text-sm ${
                        isSelected(selectedGroup, 0, null)
                          ? 'text-main-100'
                          : 'text-neutral-300'
                      }`}
                    >
                      {byGroup[selectedGroup].groupName} 전체
                    </span>
                    <i
                      className={`mgc_check_fill text-lg mb-1 ${
                        isSelected(selectedGroup, 0, null)
                          ? 'text-main-100'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                </div>
              )}

              {Object.entries(byGroup[selectedGroup].sidos).map(
                ([areaCode, { areaName, sigungus }]) => (
                  <div
                    key={areaCode}
                    className="py-1 border-b last:border-b-0 border-neutral-100"
                  >
                    <div className="px-4 py-2 text-[13px] text-neutral-500">
                      {areaName}
                    </div>
                    {/* 시도 전체 */}
                    <button
                      type="button"
                      onClick={() =>
                        toggle(selectedGroup, Number(areaCode), null)
                      }
                      className="w-full px-4 h-9 flex items-center justify-between"
                    >
                      <span
                        className={`text-sm ${
                          isSelected(selectedGroup, Number(areaCode), null)
                            ? 'text-main-100'
                            : 'text-neutral-300'
                        }`}
                      >
                        전체
                      </span>
                      <i
                        className={`mgc_check_fill text-lg mb-1 ${
                          isSelected(selectedGroup, Number(areaCode), null)
                            ? 'text-main-100'
                            : 'text-neutral-300'
                        }`}
                      />
                    </button>
                    {/* 개별 시군구 */}
                    {sigungus.map((s) => (
                      <button
                        key={`${selectedGroup}-${areaCode}-${s.code}`}
                        type="button"
                        onClick={() =>
                          toggle(selectedGroup, Number(areaCode), s.code)
                        }
                        className="w-full px-4 h-9 flex items-center justify-between"
                      >
                        <span
                          className={`text-sm ${
                            isSelected(selectedGroup, Number(areaCode), s.code)
                              ? 'text-main-100'
                              : 'text-neutral-300'
                          }`}
                        >
                          {s.name}
                        </span>
                        <i
                          className={`mgc_check_fill text-lg mb-1 ${
                            isSelected(selectedGroup, Number(areaCode), s.code)
                              ? 'text-main-100'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      {/* 선택 칩 */}
      <div className="mt-3">
        <div className="text-xs text-neutral-400 mb-2 text-right px-4">
          <span className="text-main-100">{temp.length}</span>/{MAX}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide pl-4">
          {temp.map((sel) => (
            <span
              key={`${sel.areaGroupCode}-${sel.areaCode}-${sel.sigunguCode ?? 'ALL'}`}
              className="inline-flex items-center gap-1 px-2 h-6 text-[13px] rounded-sm bg-main-5 text-main-100 whitespace-nowrap"
            >
              {prettyChip(sel)}
              <button
                type="button"
                className="ml-1 inline-flex items-center justify-center h-3 w-3"
                onClick={() => removeChip(sel)}
              >
                <i className="mgc_close_fill text-sm text-main-40 flex justify-center items-center" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
