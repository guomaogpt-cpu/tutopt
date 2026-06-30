import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
        T
      </span>
      <span className="text-xl font-semibold tracking-tight text-slate-900">Tutopt</span>
    </Link>
  );
}
