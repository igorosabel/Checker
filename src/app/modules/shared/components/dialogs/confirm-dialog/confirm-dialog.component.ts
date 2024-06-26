import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  imports: [MatDialogModule, MatButtonModule],
})
export default class ConfirmDialogComponent {
  public title: string = '';
  public content: string = '';
  public ok: string = '';
  public cancel: string | undefined;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}
