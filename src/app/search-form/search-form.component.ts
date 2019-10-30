import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent implements OnInit {
  data$: Observable<string[]> = this.share.dataArr$;
  formSearch: FormGroup;


  constructor(private share: ShareService) { }

  ngOnInit() {
    this.formSearch = new FormGroup({
      inputSearch: new FormControl(''),
    });
    this.formSearch.valueChanges.subscribe(value => {
      this.share.dataArr$.next(value.inputSearch.split(''));
    });
  }
}
