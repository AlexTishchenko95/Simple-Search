import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { FormGroup, FormControl, ValidationErrors } from '@angular/forms';

import { ShareService } from '../share.service';
import {Subject, of} from 'rxjs';
import {takeUntil, distinctUntilChanged, map, debounceTime} from 'rxjs/operators';

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

  searchCache = new Set();
  dataArray$ = of(['a', 'a', 'b', 'c', 'c', 'd', 'e', 'f', 'g', 'ab', 'abc', 'ca', 'cb']);

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
      .pipe(takeUntil(this.destroy$),
        debounceTime(2000),
        map(value => {
          if (this.searchCache.has(value)) {
           return this.onOutFromCache([value]);
          } else {
                return this.onSearchInObservable(value);
               }
        }))
      .subscribe(value => value);
  }
  ////////////////////////////////////////////

  onOutFromCache(val: string[]) {
    this.share.dataArr$.next([val + ' is find in cash']);
  }

  ////////////////////////////////////////////

  onSearchInObservable(val: string) {
    this.dataArray$
      .pipe(takeUntil(this.destroy$),
      distinctUntilChanged())
      .subscribe(arr => {
        if (arr.includes(val)) {
          this.share.dataArr$.next([val + ' find']);
          this.searchCache.add(val);
          console.log(this.searchCache);
        } else {
          this.share.dataArr$.next([val + ' not find']);
        }
     });
  }

  ////////////////////////////////////////////

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

////////////////////////////////////////////
