import { Directive, ElementRef, effect, inject, input } from '@angular/core'

type ButtonKind =
  | 'primary-fill'
  | 'primary-outline'
  | 'secondary-fill'
  | 'secondary-outline'
  | 'accent-fill'
  | 'accent-outline'

@Directive({
  selector: '[appButtonStyle]',
  standalone: true,
})
export class ButtonStyleDirective {
  styleType = input<ButtonKind>('primary-fill', { alias: 'appButtonStyle' })

  private el = inject(ElementRef<HTMLElement>)

  constructor() {
    effect(() => {
      const type = this.styleType()
      const button = this.el.nativeElement

      button.classList.remove(
        'button-primary-outline',
        'button-primary-fill',
        'button-secondary-outline',
        'button-secondary-fill',
        'button-accent-outline',
        'button-accent-fill'
      )

      button.classList.add(`button-${type}`)
    })
  }
}
