import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
  title: string;
}

export function Modal({ open, onClose, onConfirm, children, title }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        // rudimentary focus trap
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !dialogRef.current?.contains(active)) {
            last?.focus();
            e.preventDefault();
          }
        } else {
          if (active === last) {
            first?.focus();
            e.preventDefault();
          }
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Manage focus in/out
  useEffect(() => {
    if (open) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      // focus dialog or first focusable
      setTimeout(() => {
        const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
          'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        (firstFocusable ?? dialogRef.current)?.focus();
      }, 0);
    } else {
      lastFocusedRef.current?.focus?.();
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-700/40 backdrop-blur-xs" onClick={onClose} />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
        className="relative mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl outline-none"
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <Button variant="transparent-no-outline" icon={X} onClick={onClose} />
        </div>
        <div className="max-h-[70vh] overflow-auto pr-1">{children}</div>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onClose} variant="transparent">
            Cancel
          </Button>
          <Button onClick={onConfirm}>Save changes</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
export default Modal;
