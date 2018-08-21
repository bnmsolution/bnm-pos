import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {
  private el: HTMLElement;
  @Input() data: any;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.draggable = true;

    this.el.addEventListener('dragstart', (e) => {
      console.log('Start');
      this.el.classList.add('drag-src');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text', JSON.stringify(this.data));
    });

    this.el.addEventListener('dragend', (e) => {
      e.preventDefault();
      this.el.classList.remove('drag-src');
    });
  }

}
