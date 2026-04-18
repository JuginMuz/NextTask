type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 shadow-xl"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <h2
          id="confirm-dialog-title"
          className="text-xl font-semibold"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h2>

        <p
          id="confirm-dialog-description"
          className="mt-3 text-sm leading-6"
          style={{ color: "var(--muted)" }}
        >
          {description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
            style={{
              backgroundColor: "var(--danger-soft)",
              color: "var(--danger)",
              border: "1px solid var(--danger)",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;