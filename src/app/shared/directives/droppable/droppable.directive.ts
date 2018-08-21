import { Directive, ElementRef, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Directive({
  selector: '[appDroppable]'
})
export class DroppableDirective implements OnInit {
  private el: HTMLElement;
  private counter: number = 0;
  @Input() canDrop: any;
  @Output() dropped: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.addEventListener('dragenter', (e) => {
      e.preventDefault(); // needed for IE
      if (typeof this.canDrop === 'function') {
        if (this.canDrop()) {
          this.el.classList.add('over');
        }
      } else {
        this.el.classList.add('over');
      }
      this.counter++;
    });

    // Remove the style
    this.el.addEventListener('dragleave', (e) => {
      this.counter--;
      if (this.counter === 0) {
        this.el.classList.remove('over');
      }
    });

    this.el.addEventListener('dragover', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }

      e.dataTransfer.dropEffect = 'move';
      return false;
    });

    // On drop, get the data and convert it back to a JSON object
    // and fire off an event passing the data
    this.el.addEventListener('drop', (e) => {
      if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
      }

      this.el.classList.remove('over');
      let data = JSON.parse(e.dataTransfer.getData('text'));
      this.dropped.emit(data);
      return false;
    })
  }
}
