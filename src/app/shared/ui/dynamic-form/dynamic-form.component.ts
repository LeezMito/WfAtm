import { CommonModule } from '@angular/common'
import { Component, effect, inject, input, output, signal } from '@angular/core'
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatOptionModule } from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatSelectModule } from '@angular/material/select'

import { MatSnackBar } from '@angular/material/snack-bar'
import { ButtonStyleDirective } from '../../directives/button/button-style.directive'
import {
  DynamicFormSignalController,
  FieldPatch,
  FormCommand,
  ValidatorsPatch,
} from '../../interfaces/dynamic-form.controller'
import { FieldConfig } from '../../interfaces/dynamic-form.interface'

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCheckboxModule,
    ButtonStyleDirective,
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.sass'],
})
export class DynamicFormComponent {
  snackBar = inject(MatSnackBar)

  campos = input.required<ReadonlyArray<FieldConfig>>()
  titulo = input('Formulario Dinámico')
  atendidoPor = input('N/A')
  controller = input<DynamicFormSignalController | null>(null)

  fieldChanged = output<{ key: string; value: unknown }>()
  save = output<{ values: Record<string, unknown>; files: Record<string, File | null> }>()

  avance = signal(0)
  private cfgState = signal<Record<string, FieldConfig>>({})

  form = new FormGroup<Record<string, FormControl>>({})
  private files = new Map<string, File | null>()
  fileNameByKey = new Map<string, string>()
  btnClick = output<{ key: string; config: FieldConfig; event: MouseEvent }>()

  cfgOf = (key: string) => this.cfgState()[key]
  hasCtrl = (key: string) => !!this.form.get(key)

  trackByKey = (_: number, cfg: FieldConfig) => cfg.key

  private readonly _rebuildEffect = effect(
    () => {
      void this.campos()
      console.log('DynamicFormComponent: reconstruyendo formulario dinámico')
      this.buildForm()
    },
    { allowSignalWrites: true }
  )

  private readonly _controllerEffect = effect(
    () => {
      const ctrl = this.controller()
      if (!ctrl) return

      const queue = ctrl.commandQueue()
      if (queue.length === 0) return

      const cmd = queue[0]
      this.applyCommand(cmd)

      ctrl.ack()
    },
    { allowSignalWrites: true }
  )

  private buildForm(): void {
    const group: Record<string, FormControl> = {}
    const cfgRec: Record<string, FieldConfig> = {}

    for (const cfg of this.campos()) {
      const base: FieldConfig = { ...cfg, options: cfg.options?.slice() }
      cfgRec[base.key] = base

      const validators = this.mapValidators(base)

      group[base.key] = new FormControl(
        { value: base.value ?? null, disabled: !!base.disabled },
        { nonNullable: false, validators }
      )

      if (base.tipo === 'file') {
        this.files.set(base.key, null)
        this.fileNameByKey.set(base.key, '')
      }
    }

    this.form = new FormGroup(group)

    this.cfgState.set(cfgRec)
  }

  private mapValidators(cfg: FieldConfig) {
    const v = []

    if (cfg.isRequired === true) v.push(Validators.required)
    if (typeof cfg.maxLength === 'number') v.push(Validators.maxLength(cfg.maxLength))
    if (typeof cfg.minLength === 'number') v.push(Validators.minLength(cfg.minLength))
    if (typeof cfg.maxValue === 'number') v.push(Validators.max(cfg.maxValue))
    if (typeof cfg.minValue === 'number') v.push(Validators.min(cfg.minValue))

    return v
  }

  private applyValidatorsPatch(key: string, vp?: ValidatorsPatch): void {
    if (!vp) return
    const cfg = this.cfgState()[key]
    const ctrl = this.form.get(key)
    if (!cfg || !ctrl) return

    const newCfg = { ...cfg }
    if (typeof vp.required === 'boolean') newCfg.isRequired = vp.required
    if (typeof vp.maxLength === 'number') newCfg.maxLength = vp.maxLength
    if (typeof vp.minLength === 'number') newCfg.minLength = vp.minLength
    if (typeof vp.max === 'number') newCfg.maxValue = vp.max
    if (typeof vp.min === 'number') newCfg.minValue = vp.min
    ctrl.clearValidators()
    ctrl.setValidators(this.mapValidators(newCfg))
    ctrl.updateValueAndValidity({ emitEvent: true })
    this.cfgState.update((s) => ({ ...s, [key]: newCfg }))
  }

  private patchField(p: FieldPatch): void {
    const cfg = this.cfgState()[p.key]
    const ctrl = this.form.get(p.key) as FormControl | null
    if (!cfg || !ctrl) throw new Error(`DynamicFormComponent: no existe campo con key='${p.key}'`)

    if (p.disabled !== undefined) {
      p.disabled ? ctrl.disable({ emitEvent: false }) : ctrl.enable({ emitEvent: false })
    }
    if (p.value !== undefined) {
      ctrl.setValue(p.value, { emitEvent: false }) // 👈 silencioso
    }

    const newCfg: FieldConfig = { ...cfg }
    if (p.label !== undefined) newCfg.label = p.label
    if (p.placeholder !== undefined) newCfg.placeholder = p.placeholder
    if (p.options !== undefined) newCfg.options = p.options
    this.cfgState.update((s) => ({ ...s, [p.key]: newCfg }))

    if (p.validators) this.applyValidatorsPatch(p.key, p.validators)
  }

  private applyCommand(cmd: FormCommand): void {
    switch (cmd.type) {
      case 'patchField':
        this.patchField(cmd.patch)
        break
      case 'patchMany':
        cmd.patches.forEach((p) => this.patchField(p))
        break
      case 'setProgress':
        this.avance.set(cmd.value)
        break
      case 'focus': {
        this.form.get(cmd.key)?.markAsTouched()
        break
      }
      case 'mark': {
        const keys = cmd.key ? [cmd.key] : Object.keys(this.form.controls)
        keys.forEach((k) => {
          const c = this.form.get(k)
          if (!c) return
          if (cmd.touched !== undefined) cmd.touched ? c.markAsTouched() : c.markAsUntouched()
          if (cmd.dirty !== undefined) cmd.dirty ? c.markAsDirty() : c.markAsPristine()
        })
        break
      }
    }
  }

  acceptAttr(cfg: FieldConfig): string | null {
    if (cfg.tipo !== 'file') return null
    if (!cfg.fileExt?.length) return null
    return cfg.fileExt.map((e) => '.' + e.replace(/^\./, '')).join(',')
  }

  inputType(cfg: FieldConfig): string {
    if (cfg.tipo === 'input') {
      if (typeof cfg.maxValue === 'number' || typeof cfg.minValue === 'number') return 'number'
      return 'text'
    }
    return 'text'
  }

  onFileClick(inputEl: HTMLInputElement): void {
    inputEl.click()
  }

  onFileChange(cfg: FieldConfig, ev: Event): void {
    const input = ev.target as HTMLInputElement

    console.log('File input change:', input.files)

    const file = input.files && input.files.length ? input.files[0] : null

    this.files.set(cfg.key, file)
    this.fileNameByKey.set(cfg.key, file ? file.name : '')
    this.form.get(cfg.key)?.setValue(file ? file.name : null)
    this.fieldChanged.emit({ key: cfg.key, value: input.files ?? null })
  }

  onButtonClick(cfg: FieldConfig, e: MouseEvent): void {
    console.log('Button clicked:', cfg.key)
    // if (cfg.confirm && !window.confirm(cfg.confirm)) return
    this.btnClick.emit({ key: cfg.key, config: cfg, event: e })
  }

  handleSave(): void {
    this.form.markAllAsTouched()
    if (this.form.invalid) {
      this.mostrarMensaje('error', 'Corrige los errores antes de guardar.')
      return
    }
    const values = this.form.getRawValue() as Record<string, unknown>
    const filesObj: Record<string, File | null> = {}
    for (const [k, f] of this.files.entries()) filesObj[k] = f
    this.avance.set(100)
    this.save.emit({ values, files: filesObj })
  }

  ctrl(name: string) {
    return this.form.get(name) as FormControl | null
  }

  hasError(name: string, errorKey: string): boolean {
    const c = this.ctrl(name)
    return !!(c && c.touched && c.hasError(errorKey))
  }

  errorsOf(name: string): ValidationErrors | null {
    return this.ctrl(name)?.errors ?? null
  }

  lenOf(name: string): number {
    const v = this.ctrl(name)?.value
    return typeof v === 'string' ? v.length : 0
  }

  isRequiredOf(key: string): boolean {
    const c = this.form.get(key) as AbstractControl | null
    return !!c && c.hasValidator?.(Validators.required) === true
  }

  hasRenderable(cfg: FieldConfig): boolean {
    return cfg.tipo === 'button' || this.hasCtrl(cfg.key)
  }

  private mostrarMensaje(tipo: 'success' | 'error' | 'warning', mensaje: string) {
    const config = {
      duration: 3000,
      horizontalPosition: 'end' as const,
      verticalPosition: 'bottom' as const,
      panelClass: [`toast-${tipo}`],
    }
    this.snackBar.open(mensaje, 'Cerrar', config)
  }
}
