import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FolderExplorerModule } from 'src/libs/folder-explorer';
// import { FolderExplorerModule } from 'tesla-folder-explorer';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, FolderExplorerModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
