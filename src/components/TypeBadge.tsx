const styles: Record<string, { bg: string; text: string; dot: string }> = {
  employee: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  visitor: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  unknown: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  in: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  out: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
};

export default function TypeBadge({ value }: { value: string }) {
  const s = styles[value] ?? { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {value}
    </span>
  );
}
