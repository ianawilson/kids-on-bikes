import { ReactNode } from "react";

export default function Association({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-4 p-4 bg-neutral-200 rounded-3xl">
      {children}
    </div>
  )
}
