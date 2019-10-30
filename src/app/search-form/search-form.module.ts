import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from './search-form.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

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
