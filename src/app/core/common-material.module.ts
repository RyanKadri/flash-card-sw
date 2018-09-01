import { NgModule } from '@angular/core';
import { MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';

const modules = [
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
];

@NgModule({
    imports: modules,
    exports: modules
})
export class CommonMaterialModule { } 