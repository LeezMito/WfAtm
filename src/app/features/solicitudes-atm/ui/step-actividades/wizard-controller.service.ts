import { computed, Injectable, signal } from '@angular/core'
import { CAT_ACTIVIDADES, StepActividad } from '../../interfaces/step-actividad.interface'

@Injectable({ providedIn: 'root' })
export class WizardControllerService {
  private _steps = signal<StepActividad[]>([])

  steps = computed(() => this._steps())

  iniciarFlujo(flow: StepActividad[]) {
    this._steps.set(flow)
  }

  actualizarFlujo(updater: (s: StepActividad[]) => StepActividad[]) {
    this._steps.update(updater)
  }

  despacharStep(stepId: number, tipoFlujo: string, steps: StepActividad[]): void {
    switch (tipoFlujo) {
      case 'remoto':
        this.procesarFlujoRemoto(stepId, steps)
        break
      case 'nomina':
        break
      default:
        console.warn('[WIZARD CONTROLLER] Tipo de flujo no reconocido:', tipoFlujo)
        break
    }
  }

  procesarFlujoRemoto(stepId: number, steps: StepActividad[]) {
    switch (stepId) {
      case CAT_ACTIVIDADES.CARGA_SOLICITUD:
        this.procesarCargaSolicitud(steps)
        break
      case CAT_ACTIVIDADES.VALIDACION_TECNICA:
        break
      case CAT_ACTIVIDADES.VALIDACION_VISITA:
        break
      case CAT_ACTIVIDADES.VALIDACION_OPERACIONES:
        break
      case CAT_ACTIVIDADES.VALIDACION_NEGOCIO:
        break
      case CAT_ACTIVIDADES.INSTALACION:
        break
      case CAT_ACTIVIDADES.ALTA_ATM:
        break
    }
  }

  procesarCargaSolicitud(steps: StepActividad[]) {
    console.log('[WIZARD CONTROLLER] Procesando carga de solicitud', steps)
    const forms = steps.find((s) => s.id === CAT_ACTIVIDADES.CARGA_SOLICITUD)?.formsValues || []
    if (forms.length === 0) {
      console.warn('[WIZARD CONTROLLER] No hay formularios completados para la carga de solicitud')
      return
    }
    if (!forms.every((f) => f.completed)) {
      console.warn(
        '[WIZARD CONTROLLER] No todos los formularios están completos para la carga de solicitud'
      )
      return
    }
    const updatedSteps = steps.map((s) =>
      s.id === CAT_ACTIVIDADES.VALIDACION_TECNICA ? { ...s, activo: true, bloqueado: false } : s
    )
    this._steps.set(updatedSteps)
    console.log('[WIZARD CONTROLLER] Avanzando al siguiente step: Validación Técnica')
  }
}
