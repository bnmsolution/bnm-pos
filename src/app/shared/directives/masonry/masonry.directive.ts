import { Directive, ElementRef, AfterViewInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[appMasonry]'
})
export class MasonryDirective implements AfterViewInit, OnChanges {

  initialized = false;

  constructor(private el: ElementRef) {

  }

  ngOnChanges() {
    const rowGap = parseInt(getComputedStyle(this.el.nativeElement).getPropertyValue('grid-row-gap'), 10);
    const rowHeight = parseInt(getComputedStyle(this.el.nativeElement).getPropertyValue('grid-auto-rows'), 10);

    console.log(rowGap + ', ' + rowHeight);
  }


  ngAfterViewInit() {
    // this.resizeAllMasonryItems();
    const rowGap = parseInt(getComputedStyle(this.el.nativeElement).getPropertyValue('grid-row-gap'), 10);
    const rowHeight = parseInt(getComputedStyle(this.el.nativeElement).getPropertyValue('grid-auto-rows'), 10);

    console.log(rowGap + ', ' + rowHeight);

  }

  ngAfterViewChecked() {
    const rowGap = parseInt(getComputedStyle(this.el.nativeElement).getPropertyValue('grid-row-gap'), 10);
    const rowHeight = parseInt(getComputedStyle(this.el.nativeElement).getPropertyValue('grid-auto-rows'), 10);

    if (rowGap && !this.initialized) {
      this.resizeAllMasonryItems();
      this.initialized = true;
    }
  }

  /**
   * Set appropriate spanning to any masonry item
   *
   * Get different properties we already set for the masonry, calculate
   * height or spanning for any cell of the masonry grid based on its
   * content-wrapper's height, the (row) gap of the grid, and the size
   * of the implicit row tracks.
   *
   * @param item Object A brick/tile/cell inside the masonry
   */
  resizeMasonryItem(item: HTMLElement) {
    /* Get the grid object, its row-gap, and the size of its implicit rows */
    const rowGap = parseInt(getComputedStyle(this.el.nativeElement).getPropertyValue('grid-row-gap'), 10);
    const rowHeight = parseInt(getComputedStyle(this.el.nativeElement).getPropertyValue('grid-auto-rows'), 10);

    console.log(rowGap + ', ' + rowHeight);

    /*
     * Spanning for any brick = S
     * Grid's row-gap = G
     * Size of grid's implicitly create row-track = R
     * Height of item content = H
     * Net height of the item = H1 = H + G
     * Net height of the implicit row-track = T = G + R
     * S = H1 / T
     */
    const rowSpan = Math.ceil((item.querySelector('.masonry-content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));

    /* Set the spanning as calculated above (S) */
    item.style.gridRowEnd = 'span ' + rowSpan;
  }

  /**
   * Apply spanning to all the masonry items
   *
   * Loop through all the items and apply the spanning to them using
   * `resizeMasonryItem()` function.
   *
   * @uses resizeMasonryItem
   */
  resizeAllMasonryItems() {
    // Get all item class objects in one list
    const allItems = this.el.nativeElement.querySelectorAll('.masonry-brick');

    allItems.forEach(item => this.resizeMasonryItem(item));

    /*
     * Loop through the above list and execute the spanning function to
     * each list-item (i.e. each masonry item)
     */
    // for (var i = 0; i < allItems.length; i++) {
    //   this.resizeMasonryItem(allItems[i]);
    // }
  }
}
