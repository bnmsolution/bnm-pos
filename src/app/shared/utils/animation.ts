import { animate, state, style, transition, trigger } from '@angular/animations';

// Detail expanding animation for material table
export const detailExpand = [
  trigger('detailExpand', [
    state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
    state('expanded', style({ height: '*' })),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ])
];

