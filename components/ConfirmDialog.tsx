"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Lightweight in-app confirmation modal — used instead of window.confirm()
 *  so the destructive "Reset All Data" action has a proper mobile-friendly UI
 *  (window.confirm renders as an ugly native browser dialog on iOS Safari
 *  and is blocked entirely inside some installed-PWA / in-app-browser
 *  contexts). */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <>
      <div className={`sheet-overlay ${open ? "open" : ""}`} onClick={onCancel} aria-hidden={!open} />
      <div
        className={`sheet ${open ? "open" : ""}`}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        aria-hidden={!open}
      >
        <div className="sheet-handle" />
        <div className="sheet-title">{title}</div>
        <div className="sheet-sub">{message}</div>
        <button
          className={danger ? "finish-btn danger" : "finish-btn"}
          onClick={onConfirm}
          style={{ marginBottom: 10 }}
        >
          {confirmLabel}
        </button>
        <button className="dayjump-btn" style={{ width: "100%" }} onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
    </>
  );
}
