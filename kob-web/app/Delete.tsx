import React from "react";
import { Trash } from "./icons";

export default function Delete({ handler, className }: { handler: () => void, className?: string }) {
  const [inConfirm, setInConfirm] = React.useState(false)

  const handleClick = () => {
    if (!inConfirm) {
      setInConfirm(true)
    } else {
      handler()
    }
  }

  const buttonClassName = (className ? className + ' ' : '') + 'p-2 bg-rose-400 hover:bg-rose-600 text-slate-200 rounded transition-all'

  return (
    <button className={buttonClassName} onClick={handleClick} onBlur={() => setInConfirm(false)}>
      {inConfirm ? (<>Confirm?</>): (<Trash />)}
    </button>
  )
}