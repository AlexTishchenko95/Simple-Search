import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { FormGroup, FormControl, ValidationErrors } from '@angular/forms';

import { ShareService } from '../share.service';
import { Subject, from } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';

function searchValidator(control: FormControl): ValidationErrors {
  function checkValue(arr) {
    if (isNaN(arr)) {
      return true;
    }
  }
  const inputArr = control.value.split('');
  if (inputArr.every(checkValue)) {
    return null;
  }
  return { searchWarning: 'Invalid input (only string)' };
}

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent implements OnInit, OnDestroy {
  formSearch: FormGroup;
  destroy$: Subject<void> = new Subject<void>();

  dataArray$ = from(['a', 'a', 'b', 'c', 'c', 'd', 'e', 'f', 'g']).pipe(distinctUntilChanged());

  constructor(private share: ShareService) { }

  formsInit() {
    this.formSearch = new FormGroup({
      inputSearch: new FormControl('', searchValidator)
    });
  }

  ngOnInit() {
    this.formsInit();
    this.onSearch();
  }

  onSearch() {
    this.formSearch.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.dataArray$.subscribe((dataArray) => {
          const checkArray = value.inputSearch.split('');
          if (dataArray === checkArray[checkArray.length - 1]) {
            this.share.dataArr$.next([checkArray[checkArray.length - 1] + ' is finded']);
          } else {
            this.share.dataArr$.next([checkArray[checkArray.length - 1] + ' not finded']);
          }
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

// onSearch() {
//   this.formSearch.valueChanges
//     .pipe(takeUntil(this.destroy$))
//     .subscribe(value => {
//       this.dataArray$.subscribe((dataArray) => {
//         console.log(dataArray);
//         const checkArray = value.inputSearch.split('');
//         if (dataArray.includes(checkArray[checkArray.length - 1], 0)) {
//           this.share.dataArr$.next([checkArray[checkArray.length - 1] + ' is finded']);
//         } else {
//           this.share.dataArr$.next([checkArray[checkArray.length - 1] + ' not finded']);
//         }
//       });
//     });
