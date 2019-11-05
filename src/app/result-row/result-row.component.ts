import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { ShareService } from '../share.service';

@Component({
  selector: 'app-result-row',
  templateUrl: './result-row.component.html',
  styleUrls: ['./result-row.component.scss']
})
export class ResultRowComponent {
  data$: Observable<string[]> = this.share.dataArr$;

  constructor(private share: ShareService) { }
}
