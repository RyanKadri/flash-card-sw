import { NgModule } from '@angular/core';
import { MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSidenavModule, MatTooltip, MatTooltipModule, MatListModule, MatDialogModule, MatChipsModule, MatMenuModule } from '@angular/material';

const modules = [
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    MatListModule,
    MatDialogModule,
    MatChipsModule,
    MatMenuModule
];

@NgModule({
    imports: modules,
    exports: modules
})
export class CommonMaterialModule { } 