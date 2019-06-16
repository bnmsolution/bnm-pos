import { MatPaginatorIntl } from '@angular/material/paginator';
import {Injectable} from '@angular/core';

@Injectable()
export class MatPaginatorIntlKo extends MatPaginatorIntl {
  firstPageLabel = '처음';
  itemsPerPageLabel = '한 페이지에 출력할 항목 수';
  lastPageLabel = '마지막';
  nextPageLabel = '다음';
  previousPageLabel = '이전';

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '출력할 항목이 없습니다';
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `전체 ${length}개 항목 중 ${ startIndex + 1}~${endIndex}번째 항목 출력`;
  };

}
