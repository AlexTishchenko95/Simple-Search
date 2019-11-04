import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { FormGroup, FormControl, ValidationErrors } from '@angular/forms';

import { ShareService } from '../share.service';
import { Subject, from } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';

/////////////////////////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent implements OnInit, OnDestroy {
  formSearch: FormGroup;
  destroy$: Subject<void> = new Subject<void>();

  searchCash = new Set();
  dataArray$ = from(['a', 'a', 'b', 'c', 'c', 'd', 'e', 'f', 'g']).pipe(distinctUntilChanged());

  constructor(private share: ShareService) { }

  ////////////////////////////////////////////

  formsInit() {
    this.formSearch = new FormGroup({
      inputSearch: new FormControl('', searchValidator)
    });
  }

  ////////////////////////////////////////////

  ngOnInit() {
    this.formsInit();
    this.onSearch();
  }

  ////////////////////////////////////////////

  onSearch() {
    this.formSearch.get('inputSearch').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const checkArray = value.split('');
        if (this.searchCash.has(checkArray[checkArray.length - 1])) {
          this.onOutFromCash([checkArray[checkArray.length - 1]]);
        } else {
          this.searchCash.add(checkArray[checkArray.length - 1]);
          this.onSearchInObservable([checkArray[checkArray.length - 1]]);
        }
      });
  }

  ////////////////////////////////////////////

  onOutFromCash(val: string[]) {
    this.share.dataArr$.next([val + ' is find in cash']);
  }

  ////////////////////////////////////////////

  onSearchInObservable(val: string[]) {
    const dataArray = [];

    this.dataArray$
      .pipe(takeUntil(this.destroy$))
      .subscribe((arr) => dataArray.push(arr));
    if (dataArray.includes(val[0])) {
        this.share.dataArr$.next([val[0] + ' find']);
      } else {
        this.share.dataArr$.next([val[0] + ' not find']);
      }
  }

  ////////////////////////////////////////////

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

////////////////////////////////////////////

