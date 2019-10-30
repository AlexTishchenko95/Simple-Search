import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  readonly dataArr$ = new BehaviorSubject([]);

  constructor() { }
}
