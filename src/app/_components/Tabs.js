import React from 'react';

const Tabs = ({ tabs, activeTab, setActiveTab, type }) => {
  return (
    <div className="flex justify-around border-b border-neutral-200 mt-2 pt-1">
      {tabs.map((tab, index) => {
        const isActive = activeTab === index;

        // festival 타입일 경우 공통 스타일(font-medium)
        const baseFont =
          type === 'festival'
            ? 'font-medium'
            : isActive
              ? 'font-bold'
              : 'font-semibold';

        return (
          <div
            key={index}
            className={`flex flex-col items-center justify-end cursor-pointer px-4 text-base ${
              isActive ? 'text-main-100' : 'text-neutral-300'
            } ${baseFont}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
            <hr
              className={`mt-2 transition-all duration-500 ease-out ${
                isActive ? 'w-[80%]' : 'w-[0px]'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;
