import { Directive, ElementRef, Input, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[appInputDescription]'
})
/**
 * This directive changes an element's top position to make it align with the target element.
 */
export class InputDescriptionDirective implements AfterViewChecked {


  // target element
  @Input() target: any;
  // target element's id (use id for directives)
  @Input() targetId: string;
  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef
  ) {
    this.el = this.elementRef.nativeElement;
  }


  ngAfterViewChecked(): void {
    this.setLabel();
  }

  private setLabel() {
    let offsetTop = 0;
    if (this.targetId) {
      const element = document.getElementById(this.targetId);
      if (element) {
        offsetTop = element.offsetTop;
      }
    } else if (this.target) {
      offsetTop = this.target._elementRef.nativeElement.offsetTop;
    }
    this.el.style.top = offsetTop + 'px';
  }
}
