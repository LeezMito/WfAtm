import { animate, style, transition, trigger } from '@angular/animations'
import { ComponentType } from '@angular/cdk/overlay'
import { Component, input, signal } from '@angular/core'

@Component({
  selector: 'app-template-actividad',
  standalone: true,
  imports: [],
  templateUrl: './template-actividad.component.html',
  styleUrl: './template-actividad.component.sass',
  animations: [
    trigger('reveal', [
      transition(':enter', [
        style({ height: 0, opacity: 0, transform: 'translateY(4px)' }),
        animate(
          '240ms cubic-bezier(.22,.61,.36,1)',
          style({ height: '*', opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '180ms cubic-bezier(.22,.61,.36,1)',
          style({ height: 0, opacity: 0, transform: 'translateY(4px)' })
        ),
      ]),
    ]),
  ],
})
export class TemplateActividadComponent {
  title = input<string>('Actividad')
  titleInicia = input<string>('Incia')
  inicia = input<string>('2024-01-01')
  avance = input<number>(0)

  private _open = signal(false)
  isOpen = this._open

  formComponent = input<ComponentType<unknown> | null>(null)

  toggleForm() {
    this._open.update((v) => !v)
  }
}
