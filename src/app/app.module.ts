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
import {
    FaIconLibrary,
    FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
    faBars,
    faMugHot,
    faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
    declarations: [
        AppComponent,
        SideBarComponent,
        AddEntryComponent,
        EntryComponent,
        PreviewComponent,
        PlayerComponent,
    ],
    imports: [BrowserModule, CommonModule, FontAwesomeModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faBars, faPlusCircle, faMugHot);
    }
}
