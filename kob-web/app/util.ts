'use client'

export type Debouncer = (action: () => void, delayMillis: number) => void;

export function makeDebouncer(): Debouncer {
  let timeout: ReturnType<typeof setTimeout>
  return (action: () => void, delayMillis: number) => {
    clearTimeout(timeout)
    timeout = setTimeout(action, delayMillis)
  }
}

interface IdableObject { id?: number }

export class DebounceById<Type extends IdableObject> {
  private debouncers: { [key: number]: Debouncer }

  constructor() {
    this.debouncers = {}
  }

   getDebouncer(obj: Type) {
    if (obj.id === undefined) {
      throw new Error('cannot make a debouncer for obj with an undefined id')
    }

    if (this.debouncers[obj.id] === undefined) {
      this.debouncers[obj.id] = makeDebouncer()
    }

    return this.debouncers[obj.id]
  }
}