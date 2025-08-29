'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

const ANIM_MS = 220; // 입/퇴장 애니메이션 길이(ms)
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
};

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID)
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]); // { id, message, variant, duration?, _state }
  const [mounted, setMounted] = useState(false);
  const timersRef = useRef({});
  const leavingRef = useRef({});

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
      Object.values(leavingRef.current).forEach(clearTimeout);
      timersRef.current = {};
      leavingRef.current = {};
    };
  }, []);

  const dismissHard = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismiss = useCallback(
    (id) => {
      if (timersRef.current[id]) {
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
      }

      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, _state: 'exit' } : t))
      );

      leavingRef.current[id] = window.setTimeout(() => {
        delete leavingRef.current[id];
        dismissHard(id);
      }, ANIM_MS);
    },
    [dismissHard]
  );

  const clear = useCallback(() => {
    const ids = toasts.map((t) => t.id);
    setToasts((prev) => prev.map((t) => ({ ...t, _state: 'exit' })));
    ids.forEach((id) => {
      if (timersRef.current[id]) {
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
      }
      leavingRef.current[id] = window.setTimeout(() => {
        delete leavingRef.current[id];
        dismissHard(id);
      }, ANIM_MS);
    });
  }, [toasts, dismissHard]);

  const show = useCallback(
    (input) => {
      const id = genId();
      const toast =
        typeof input === 'string'
          ? { id, message: input, _state: 'enter' }
          : { id, ...input, _state: 'enter' };

      setToasts((prev) => [...prev, toast]);

      requestAnimationFrame(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, _state: 'idle' } : t))
        );
      });

      const ms = toast.duration ?? 3000;
      if (ms > 0) {
        timersRef.current[id] = window.setTimeout(() => dismiss(id), ms);
      }
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({ show, dismiss, clear }),
    [show, dismiss, clear]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] flex w-full max-w-xs flex-col gap-2">
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

function ToastItem({ toast }) {
  const { message, variant = 'default', _state = 'idle' } = toast;

  const styles = {
    default: <></>,
    success: <i className="mgc_check_circle_fill text-main-100" />,
    error: <i className="mgc_close_circle_fill text-red-400" />,
  };

  const anim =
    _state === 'enter'
      ? 'opacity-0 translate-y-1 scale-95'
      : _state === 'exit'
        ? 'opacity-0 translate-y-1 scale-95'
        : 'opacity-100 translate-y-0 scale-100';
  return (
    <div
      className={`
        pointer-events-auto bg-[#525252]/70 text-background rounded-full shadow-lg px-4 py-3
        transform transition-all duration-[${ANIM_MS}ms] ease-out
        ${anim}
      `}
    >
      <div className="flex items-center justify-center gap-3">
        {styles[variant]}
        <div className="text-sm font-normal text-background leading-5 whitespace-pre-line">
          {message}
        </div>
      </div>
    </div>
  );
}
