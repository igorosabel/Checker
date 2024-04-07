import { Component, OnInit, Signal, inject, viewChild } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import { UserService } from '@app/services/user.service';
import { CheckinTypesResult } from '@interfaces/checkins.interfaces';
import { StatusResult } from '@interfaces/interfaces';
import { CheckinType } from '@model/checkintype.model';
import { ApiService } from '@services/api.service';
import { ClassMapperService } from '@services/class-mapper.service';
import { DialogService } from '@services/dialog.service';
import CheckinTypeComponent from '@shared/components/checkin-type/checkin-type.component';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'app-checkin-types',
  standalone: true,
  imports: [
    HeaderComponent,
    CheckinTypeComponent,
    MatCard,
    MatCardContent,
    MatList,
    MatListItem,
    MatListItemTitle,
    MatListItemLine,
    MatFabButton,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './checkin-types.component.html',
  styleUrl: './checkin-types.component.scss',
})
export default class CheckinTypesComponent implements OnInit {
  us: UserService = inject(UserService);
  as: ApiService = inject(ApiService);
  cms: ClassMapperService = inject(ClassMapperService);
  ds: DialogService = inject(DialogService);

  checkinTypes: CheckinType[] = [];
  ct: Signal<CheckinTypeComponent> =
    viewChild.required<CheckinTypeComponent>('ct');

  ngOnInit(): void {
    this.loadCheckinTypes();
  }

  loadCheckinTypes(): void {
    this.as.getCheckinTypes().subscribe((result: CheckinTypesResult): void => {
      this.checkinTypes = this.cms.getCheckinTypes(result.list);
      this.us.checkinTypeList.set(this.checkinTypes);
      this.us.saveLogin();
    });
  }

  addNew(): void {
    this.ct().load(new CheckinType());
  }

  editCheckinType(ct: CheckinType): void {
    this.ct().load(ct);
  }

  checkinTypeSaved(): void {
    this.loadCheckinTypes();
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
}
