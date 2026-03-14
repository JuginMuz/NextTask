type TaskFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

function TaskForm({ value, onChange, onSubmit }: TaskFormProps) {
  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        Create a new task
      </h2>

      <form onSubmit={onSubmit} className="flex gap-3">
        <input
          type="text"
          placeholder="Enter a micro-task..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Add task
        </button>
      </form>
    </div>
  );
}

export default TaskForm;