'use client';

import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toastCount = 0;

const listeners: Array<(toasts: Toast[]) => void> = [];
let memoryToasts: Toast[] = [];

function dispatch(action: { type: 'ADD_TOAST' | 'DISMISS_TOAST'; toast?: Omit<Toast, 'id'>; id?: string }) {
  if (action.type === 'ADD_TOAST' && action.toast) {
    const id = String(++toastCount);
    memoryToasts = [...memoryToasts, { ...action.toast, id }];

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'DISMISS_TOAST', id });
    }, 5000);
  } else if (action.type === 'DISMISS_TOAST' && action.id) {
    memoryToasts = memoryToasts.filter((t) => t.id !== action.id);
  }

  listeners.forEach((listener) => listener(memoryToasts));
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(memoryToasts);

  useState(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) listeners.splice(index, 1);
    };
  });

  const toast = useCallback(
    ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
      dispatch({ type: 'ADD_TOAST', toast: { title, description, variant } });
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'DISMISS_TOAST', id });
  }, []);

  return { toasts, toast, dismiss };
}

export { type Toast };
