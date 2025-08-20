'use client';
import { useRef } from 'react';

export default function BottomInputBox({
  classname,
  context,
  setContext,
  sendMsg,
}) {
  const textarea = useRef();
  const handleResizeHeight = () => {
    textarea.current.style.height = 'auto'; //height 초기화
    textarea.current.style.height = textarea.current.scrollHeight + 'px';
  };

  return (
    <div className={classname}>
      <div className="flex border border-main-15 rounded-lg bg-background items-center px-4 py-[13px]">
        <textarea
          ref={textarea}
          className="w-full placeholder-neutral-300 text-base font-normal text-neutral-900 outline-none resize-none"
          placeholder="방명록을 남겨주세요"
          rows={1}
          maxLength={200}
          onChange={(e) => {
            handleResizeHeight();
            setContext(e.target.value);
          }}
          value={context}
        />
        <i className="mgc_send_fill text-3xl text-main-100" onClick={sendMsg} />
      </div>
    </div>
  );
}
