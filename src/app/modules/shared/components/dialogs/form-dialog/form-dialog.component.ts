import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogField } from '@interfaces/interfaces';

@Component({
  standalone: true,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export default class FormDialogComponent {
  public title: string = '';
  public content: string = '';
  public fields: DialogField[] | undefined;
  public ok: string = '';
  public cancel: string | undefined;

  constructor(public dialogRef: MatDialogRef<FormDialogComponent>) {}
}
