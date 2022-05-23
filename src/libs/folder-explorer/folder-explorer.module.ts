import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AddFolderComponent, FolderExplorerComponent } from './components';
import { FolderExplorerView } from './views';

@NgModule({
    imports: [CommonModule],
    declarations: [
        FolderExplorerView,
        FolderExplorerComponent,
        AddFolderComponent,
    ],
    exports: [FolderExplorerView],
})
export class FolderExplorerModule {}
