import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    FaIconLibrary,
    FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
    faBars,
    faMugHot,
    faPause,
    faPlay,
    faPlusCircle,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { AppComponent } from './app.component';
import {
    AddEntryComponent,
    EntryComponent,
    PlayerComponent,
    PreviewComponent,
    SideBarComponent,
    TimelineComponent,
} from './libs/components';

@NgModule({
    declarations: [
        AppComponent,
        SideBarComponent,
        AddEntryComponent,
        EntryComponent,
        PreviewComponent,
        PlayerComponent,
        TimelineComponent,
    ],
    imports: [BrowserModule, CommonModule, FontAwesomeModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(
            faBars,
            faPlusCircle,
            faMugHot,
            faSpinner,
            faPause,
            faPlay
        );
    }
}
