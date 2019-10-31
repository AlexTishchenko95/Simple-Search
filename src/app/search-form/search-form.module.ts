import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchFormComponent } from './search-form.component';



@NgModule({
  declarations: [SearchFormComponent],
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [SearchFormComponent]
})
export class SearchFormModule { }
