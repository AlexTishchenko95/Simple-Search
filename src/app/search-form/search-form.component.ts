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
    const dataArray = [];
    const alreadySearch = new Set();

    this.dataArray$
      .pipe(takeUntil(this.destroy$))
      .subscribe((arr) => dataArray.push(arr));
    this.formSearch.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const checkArray = value.inputSearch.split('');

        if (alreadySearch.has(checkArray[checkArray.length - 1])) {
          this.share.dataArr$.next([checkArray[checkArray.length - 1] + ' has already searched']);
        } else {
          alreadySearch.add(checkArray[checkArray.length - 1]);
          if (dataArray.includes(checkArray[checkArray.length - 1])) {
            this.share.dataArr$.next([checkArray[checkArray.length - 1] + ' is finded']);
          } else {
            this.share.dataArr$.next([checkArray[checkArray.length - 1] + ' not finded']);
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
