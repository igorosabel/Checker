import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  OutputEmitterRef,
  Signal,
  WritableSignal,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { StatusResult } from '@interfaces/interfaces';
import { CheckinType } from '@model/checkintype.model';
import { DialogService } from '@osumi/angular-tools';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-checkin-type',
  imports: [
    NgClass,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatIconButton,
    MatIcon,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatSlideToggle,
    FormsModule,
  ],
  templateUrl: './checkin-type.component.html',
  styleUrl: './checkin-type.component.scss',
})
export default class CheckinTypeComponent {
  as: ApiService = inject(ApiService);
  ds: DialogService = inject(DialogService);

  showModal: WritableSignal<boolean> = signal<boolean>(false);
  modalTitle: string = '';
  selectedCheckinType: CheckinType = new CheckinType();
  checkinTypeValidName: boolean = true;
  nameBox: Signal<ElementRef> = viewChild.required<ElementRef>('nameBox');

  saved: OutputEmitterRef<void> = output();

  load(ct: CheckinType): void {
    this.selectedCheckinType = ct;
    if (ct.id !== null) {
      this.modalTitle = 'Nuevo tipo de Checkin';
    } else {
      this.modalTitle = 'Editar tipo de Checkin';
    }
    this.showModal.set(true);
    window.setTimeout((): void => {
      this.nameBox().nativeElement.focus();
    }, 100);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  checkForm(): void {
    this.checkinTypeValidName = true;
    if (
      this.selectedCheckinType.name === null ||
      this.selectedCheckinType.name === ''
    ) {
      this.checkinTypeValidName = false;
      return;
    }

    this.as
      .saveCheckinType(this.selectedCheckinType.toInterface())
      .subscribe((result: StatusResult): void => {
        if (result.status === 'ok') {
          this.ds
            .alert({
              title: 'Datos guardados',
              content: 'Los datos del tipo de Checkin han sido guardados.',
              ok: 'Continuar',
            })
            .subscribe((): void => {
              this.saved.emit();
              this.closeModal();
            });
        } else {
          this.ds.alert({
            title: 'Error',
            content: 'Ocurrió un error al guardar el tipo de Checkin.',
            ok: 'Continuar',
          });
        }
      });
  }
}
