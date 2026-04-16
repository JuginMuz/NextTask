type TaskFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
};

function TaskForm({ value, onChange, onSubmit }: TaskFormProps) {
  return (
    <section
      className="rounded-3xl p-6 shadow-sm"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <h2
        className="text-2xl font-semibold"
        style={{ color: "var(--text)" }}
      >
        Create a new task
      </h2>

      <p
        className="mt-2 text-sm"
        style={{ color: "var(--muted)" }}
      >
        Break larger goals into short, manageable micro-tasks.
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="new-task" className="sr-only">
          Enter a new micro-task
        </label>

        <input
          id="new-task"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Try "Read 2 pages" or "Reply to one email"'
          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        />

        <button
          type="submit"
          aria-label="Add new task"
          className="rounded-xl px-4 py-2 text-sm font-semibold outline-none"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-text)",
            border: "1px solid transparent",
          }}
        >
          Add task
        </button>
      </form>
    </section>
  );
}

export default TaskForm;