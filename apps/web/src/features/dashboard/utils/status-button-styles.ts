const STATUS_COLORS = {
  all: {
    active:
      "bg-slate-600 dark:bg-slate-400 text-white dark:text-slate-950 hover:bg-slate-700 dark:hover:bg-slate-300 shadow-sm",
    inactive:
      "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800",
  },
  saved: {
    active:
      "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-400 shadow-sm",
    inactive:
      "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950",
  },
  applied: {
    active:
      "bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-400 shadow-sm",
    inactive:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950",
  },
  interviewing: {
    active:
      "bg-violet-600 dark:bg-violet-500 text-white hover:bg-violet-700 dark:hover:bg-violet-400 shadow-sm",
    inactive:
      "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-950",
  },
  offered: {
    active:
      "bg-amber-600 dark:bg-amber-500 text-white hover:bg-amber-700 dark:hover:bg-amber-400 shadow-sm",
    inactive:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950",
  },
  rejected: {
    active:
      "bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-400 shadow-sm",
    inactive:
      "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950",
  },
  new: {
    active:
      "bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-400 shadow-sm",
    inactive:
      "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950",
  },
  deleted: {
    active:
      "bg-gray-600 dark:bg-gray-500 text-white hover:bg-gray-700 dark:hover:bg-gray-400 shadow-sm",
    inactive:
      "bg-gray-50 dark:bg-gray-950/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950",
  },
} as const satisfies Record<string, { active: string; inactive: string }>;

export function getStatusButtonClass(
  currentStatus: string | null,
  buttonValue: string
): string {
  const isActive = currentStatus === buttonValue;
  const colors =
    (STATUS_COLORS as Record<string, { active: string; inactive: string }>)[
      buttonValue
    ] || STATUS_COLORS.all;
  return `rounded-lg px-4 py-2 font-medium text-sm transition-all ${
    isActive ? colors.active : colors.inactive
  }`;
}
