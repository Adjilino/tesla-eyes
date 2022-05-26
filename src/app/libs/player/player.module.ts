import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlayerView } from './views';

@NgModule({
    imports: [CommonModule],
    declarations: [PlayerView],
    exports: [PlayerView],
})
export class PlayerModule {}
