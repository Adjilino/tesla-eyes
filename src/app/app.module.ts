import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {
    AddEntryComponent,
    EntryComponent,
    PlayerComponent,
    PreviewComponent,
    SideBarComponent,
} from './libs/components';

@NgModule({
    declarations: [
        AppComponent,
        SideBarComponent,
        AddEntryComponent,
        EntryComponent,
        PreviewComponent,
        PlayerComponent,
    ],
    imports: [BrowserModule, CommonModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
