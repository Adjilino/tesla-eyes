import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AddEntry, SideBar } from './libs/components';

@NgModule({
    declarations: [AppComponent, SideBar, AddEntry],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
