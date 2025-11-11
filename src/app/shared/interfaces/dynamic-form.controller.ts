import { computed, Signal, signal } from '@angular/core'

export interface SelectOption {
  value: string | number | boolean
  label: string
}

export type ValidatorsPatch = {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
}

export type FieldPatch = {
  key: string
  value?: unknown
  disabled?: boolean
  hidden?: boolean
  label?: string
  placeholder?: string
  options?: ReadonlyArray<SelectOption>
  validators?: ValidatorsPatch
  touched?: boolean
  dirty?: boolean
}

export type FormCommand =
  | { type: 'patchField'; patch: FieldPatch }
  | { type: 'patchMany'; patches: FieldPatch[] }
  | { type: 'setProgress'; value: number }
  | { type: 'focus'; key: string }
  | { type: 'mark'; key?: string; touched?: boolean; dirty?: boolean }

export interface DynamicFormSignalController {
  command: Signal<{ v: number; cmd: FormCommand | null }>

  commandQueue: Signal<FormCommand[]>
  ack: () => void

  patchField: (patch: FieldPatch) => void
  patchMany: (patches: FieldPatch[]) => void
  setProgress: (value: number) => void
  focus: (key: string) => void
  mark(key?: string, touched?: boolean, dirty?: boolean): void
}

export function createDynamicFormSignalController(): DynamicFormSignalController {
  const _cmd = signal<FormCommand | null>(null)
  const _version = signal(0)
  const command = computed(() => ({ v: _version(), cmd: _cmd() }))

  const _queue = signal<FormCommand[]>([])
  const commandQueue = computed(() => {
    _version()
    return _queue()
  })

  const publish = (c: FormCommand) => {
    _cmd.set(c)
    _queue.update((q) => [...q, c])
    _version.update((x) => x + 1)
  }

  const ack = () => {
    _queue.update((q) => q.slice(1))
    _version.update((x) => x + 1)
  }

  return {
    command,
    commandQueue,
    ack,
    patchField: (patch: FieldPatch) => publish({ type: 'patchField', patch }),
    patchMany: (patches: FieldPatch[]) => publish({ type: 'patchMany', patches }),
    setProgress: (value: number) => publish({ type: 'setProgress', value }),
    focus: (key: string) => publish({ type: 'focus', key }),
    mark: (key?: string, touched?: boolean, dirty?: boolean) =>
      publish({ type: 'mark', key, touched, dirty }),
  }
}
