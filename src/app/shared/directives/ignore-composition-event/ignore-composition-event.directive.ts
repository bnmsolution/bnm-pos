import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appIgnoreCompositionEvent]'
})
export class IgnoreCompositionEventDirective implements OnInit {

  private el: any;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.addEventListener('compositionstart', event => {
      console.log('composition start');
    });
    this.el.addEventListener('compositionend', event => {
      console.log('composition end');
    });
  }
}