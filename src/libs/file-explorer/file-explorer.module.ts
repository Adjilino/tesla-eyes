import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AddFolderComponent, FileExplorerComponent } from './components';
import { FileExplorerView } from './views';

@NgModule({
    imports: [CommonModule],
    declarations: [FileExplorerView, FileExplorerComponent, AddFolderComponent],
    exports: [FileExplorerView],
})
export class FileExplorerModule {}
