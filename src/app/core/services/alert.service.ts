import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ConfirmationDialogComponent, AlertOptions } from "../../shared/confirmation-dialog/confirmation-dialog.component";

@Injectable({ providedIn: 'root' })
export class AlertService {

    constructor(
        private dialog: MatDialog
    ) {}

    private readonly defaultAlertOptions: Partial<AlertOptions> = { 
        acceptText: 'Okay',
        rejectText: 'Cancel',
    }

    showConfirmationAlert<T>(options: AlertOptions, cb: () => T | Promise<T>) {
        const fullOptions = { ...this.defaultAlertOptions, ...options };
        const dialog = this.dialog.open(ConfirmationDialogComponent, { data: fullOptions });
        return dialog.afterClosed().toPromise().then(accepted => {
            if(accepted) {
                cb();
            }
        });
    }
}

