import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[appToggleSection]' })
export class ToggleSectionDirective {
  private _isOpen: boolean;

  constructor(private el: ElementRef) {
    el.nativeElement.classList.add('toggle-section');
  }

  @Input('appToggleSection')
  set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;
    if (isOpen) {
      const targetHeight: number = this.getTargetHeight();
      setTimeout(() => {
        this.el.nativeElement.style.height = targetHeight + 'px';
      }, 0);
    } else {
      this.el.nativeElement.style.height = 0;
    }
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  private getTargetHeight(): number {
    let targetHeight: number;
    this.el.nativeElement.classList.add('no-transition');
    this.el.nativeElement.style.height = '';
    targetHeight = this.el.nativeElement.clientHeight;
    this.el.nativeElement.style.height = 0;
    this.el.nativeElement.classList.remove('no-transition');
    return targetHeight;
  }
}
