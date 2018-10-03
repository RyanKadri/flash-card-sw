import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {

  constructor(
    private ref: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialog: AlertOptions
  ) { }

  reject() {
    this.ref.close(false);
  }

  accept() {
    this.ref.close(true);
  }
}

export interface AlertOptions {
  title: string;
  desc?: string;
  acceptText?: string;
  rejectText?: string;
}