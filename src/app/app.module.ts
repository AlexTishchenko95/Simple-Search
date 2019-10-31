import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { SearchFormModule } from './search-form/search-form.module';
import { HeaderModule } from './header/header.module';
import { ResultRowModule } from './result-row/result-row.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HeaderModule,
    SearchFormModule,
    BrowserAnimationsModule,
    ResultRowModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
