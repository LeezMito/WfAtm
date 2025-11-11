import { CommonModule } from '@angular/common'
import { Component, computed, effect, inject, input, Input } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import {
  CAT_ACTIVIDADES,
  FlujoRemoto,
  FormularioValues,
  StepActividad,
} from '../../interfaces/step-actividad.interface'
import { ActividadAltaAtmComponent } from '../actividades/actividad-alta-atm/actividad-alta-atm.component'
import { ActividadCargaSolicitudComponent } from '../actividades/actividad-carga-solicitud/actividad-carga-solicitud.component'
import { ActividadInstalacionComponent } from '../actividades/actividad-instalacion/actividad-instalacion.component'
import { ActividadValidacionNegocioComponent } from '../actividades/actividad-validacion-negocio/actividad-validacion-negocio.component'
import { ActividadValidacionOperacionesComponent } from '../actividades/actividad-validacion-operaciones/actividad-validacion-operaciones.component'
import { ActividadValidacionTecnicaComponent } from '../actividades/actividad-validacion-tecnica/actividad-validacion-tecnica.component'
import { ActividadValidacionVisitaComponent } from '../actividades/actividad-validacion-visita/actividad-validacion-visita.component'
import { WizardControllerService } from './wizard-controller.service'

@Component({
  selector: 'app-step-actividades',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ActividadCargaSolicitudComponent,
    ActividadValidacionTecnicaComponent,
    ActividadValidacionVisitaComponent,
    ActividadValidacionOperacionesComponent,
    ActividadValidacionNegocioComponent,
    ActividadInstalacionComponent,
    ActividadAltaAtmComponent,
  ],
  templateUrl: './step-actividades.component.html',
  styleUrls: ['./step-actividades.component.sass'],
})
export class StepActividadesComponent {
  private ctl = inject(WizardControllerService)
  steps = this.ctl.steps

  @Input() inicio = 1

  tipoAtm = input.required<string>()
  idSolicitud = input<string>()

  vm = computed(() => ({
    tipoAtm: this.tipoAtm(),
    idSolicitud: this.idSolicitud(),
  }))

  modo = computed(() => (this.idSolicitud() ? 'editar' : 'nuevo'))

  private startFlowEff = effect(
    () => {
      const atm = this.tipoAtm()
      const id = this.idSolicitud()

      if (atm) {
        this.iniciar(atm)
      }
      if (id) {
        console.log('ID Solicitud en StepActividades:', id)
      }
    },
    { allowSignalWrites: true }
  )

  iniciar(atm: string) {
    console.log('Tipo ATM recibido en StepActividades:', atm)
    this.ctl.iniciarFlujo(atm === 'remoto' ? FlujoRemoto : [])
    //console.log('ID Solicitud recibido en StepActividades:', idSolicitud)
  }

  trackById = (_: number, s: StepActividad) => s.id
  currentStep = computed(() => this.steps().find((s) => s.activo))

  CAT_ACTIVIDADES = CAT_ACTIVIDADES

  updAvance(id: number, avance: number): void {
    console.log('[STEPPER:AVANCE] id =>', id, 'avance =>', avance)
    this.ctl.actualizarFlujo((currentSteps) =>
      currentSteps.map((step) =>
        step.id === id ? { ...step, progreso: step.progreso + avance } : step
      )
    )
  }

  avanzarStep(stepId: number, forms: FormularioValues[]): void {
    console.log('[STEPPER:AVANZAR] id =>', stepId, 'forms =>', forms)

    const current = this.ctl.steps()
    const exists = current.some((s) => s.id === stepId)
    if (!exists) return

    const nextSteps = current.map((s) =>
      s.id === stepId ? { ...s, formsValues: forms, progreso: 100, activo: false } : s
    )

    this.ctl.actualizarFlujo(() => nextSteps)
    this.ctl.despacharStep(stepId, this.tipoAtm(), nextSteps)
  }

  cambiarStep(id: number): void {
    this.ctl.actualizarFlujo((list) => list.map((step) => ({ ...step, activo: step.id === id })))
  }

  bloquearStep(id: number): void {
    this.ctl.actualizarFlujo((list) =>
      list.map((step) => (step.id === id ? { ...step, bloqueado: true } : step))
    )
  }

  desbloquearStep(id: number): void {
    this.ctl.actualizarFlujo((list) =>
      list.map((step) => (step.id === id ? { ...step, bloqueado: false } : step))
    )
  }

  actualizarStep(id: number, cambios: Partial<StepActividad>): void {
    this.ctl.actualizarFlujo((list) =>
      list.map((step) => (step.id === id ? { ...step, ...cambios } : step))
    )
  }

  resetSteps(): void {
    const inicio = this.inicio
    this.ctl.actualizarFlujo((list) =>
      list.map((s) => ({
        ...s,
        activo: s.id === inicio,
        bloqueado: false,
      }))
    )
  }
  onActivate(id: number) {
    const s = this.steps().find((x) => x.id === id)
    if (!s || s.bloqueado) return
    this.cambiarStep(id)
  }
}
