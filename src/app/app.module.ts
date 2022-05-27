import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AddEntryComponent, EntryComponent, SideBarComponent } from './libs/components';

@NgModule({
    declarations: [AppComponent, SideBarComponent, AddEntryComponent, EntryComponent],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
