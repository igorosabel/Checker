import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButton,
  MatFabButton,
  MatIconButton,
} from '@angular/material/button';
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
import {
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CheckinTypesResult } from '@interfaces/checkins.interfaces';
import { StatusResult } from '@interfaces/interfaces';
import { CheckinType } from '@model/checkintype.model';
import { ApiService } from '@services/api.service';
import { ClassMapperService } from '@services/class-mapper.service';
import { DialogService } from '@services/dialog.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'app-checkin-types',
  standalone: true,
  imports: [
    HeaderComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatList,
    MatListItem,
    MatListItemTitle,
    MatListItemLine,
    MatFabButton,
    MatIconButton,
    MatIcon,
    NgClass,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatSlideToggle,
    FormsModule,
  ],
  templateUrl: './checkin-types.component.html',
  styleUrl: './checkin-types.component.scss',
})
export default class CheckinTypesComponent implements OnInit {
  as: ApiService = inject(ApiService);
  cms: ClassMapperService = inject(ClassMapperService);
  ds: DialogService = inject(DialogService);

  checkinTypes: CheckinType[] = [];
  showModal: WritableSignal<boolean> = signal<boolean>(false);
  modalTitle: string = '';
  selectedCheckinType: CheckinType = new CheckinType();
  checkinTypeValidName: boolean = true;
  nameBox: Signal<ElementRef> = viewChild.required<ElementRef>('nameBox');

  ngOnInit(): void {
    this.loadCheckinTypes();
  }

  loadCheckinTypes(): void {
    this.as.getCheckinTypes().subscribe((result: CheckinTypesResult): void => {
      this.checkinTypes = this.cms.getCheckinTypes(result.list);
    });
  }

  addNew(): void {
    this.selectedCheckinType = new CheckinType();
    this.modalTitle = 'Nuevo tipo de Checkin';
    this.showModal.set(true);
    window.setTimeout((): void => {
      this.nameBox().nativeElement.focus();
    }, 100);
  }

  editCheckinType(ct: CheckinType): void {
    this.selectedCheckinType = ct;
    this.modalTitle = 'Editar tipo de Checkin';
    this.showModal.set(true);
    window.setTimeout((): void => {
      this.nameBox().nativeElement.focus();
    }, 100);
  }

  deleteCheckinType(ct: CheckinType): void {
    this.ds
      .confirm({
        title: 'Borrar tipo de Checkin',
        content: `¿Estás seguro de querer borrar el tipo de Checkin "${ct.name}"?`,
        ok: 'Continuar',
        cancel: 'Cancelar',
      })
      .subscribe((conf: boolean): void => {
        if (conf && ct.id !== null) {
          this.confirmDeleteCheckin(ct.id);
        }
      });
  }

  confirmDeleteCheckin(id: number): void {
    this.as.deleteCheckinType(id).subscribe((result: StatusResult): void => {
      if (result.status === 'ok') {
        this.ds
          .alert({
            title: 'Tipo de Checkin borrado',
            content:
              'El tipo de Checkin y todos sus Checkins asociados han sido borrados.',
            ok: 'Continuar',
          })
          .subscribe((): void => {
            this.loadCheckinTypes();
          });
      } else {
        this.ds.alert({
          title: 'Error',
          content: 'Ocurrió un error al borrar el tipo de Checkin.',
          ok: 'Continuar',
        });
      }
    });
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
              this.loadCheckinTypes();
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
