import { ReactNode } from "react";

export default function Card({children}: {children?: ReactNode}) {
  return (
    <div className="p-4 rounded-2xl bg-slate-300 flex flex-col gap-4">
      {children}
    </div>
  )
}