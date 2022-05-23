import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FileExplorerModule } from 'src/libs/file-explorer';
// import { FileExplorerModule } from 'tesla-file-explorer';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, FileExplorerModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
