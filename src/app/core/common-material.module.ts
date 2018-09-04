import { NgModule } from '@angular/core';
import { MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSidenavModule, MatTooltip, MatTooltipModule, MatListModule } from '@angular/material';

const modules = [
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    MatListModule
];

@NgModule({
    imports: modules,
    exports: modules
})
export class CommonMaterialModule { } 