import { NgClass } from '@angular/common';
import {
  Component,
  OnInit,
  OutputEmitterRef,
  WritableSignal,
  inject,
  output,
  signal,
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
import { MatIcon } from '@angular/material/icon';
import { MatHint, MatInput } from '@angular/material/input';
import {
  MatFormField,
  MatLabel,
  MatOption,
  MatSelect,
} from '@angular/material/select';
import { StatusResult } from '@app/interfaces/interfaces';
import { ApiService } from '@app/services/api.service';
import { Checkin } from '@model/checkin.model';
import { CheckinType } from '@model/checkintype.model';
import { DialogService } from '@services/dialog.service';
import { UserService } from '@services/user.service';
import { Utils } from '@shared/utils.class';

@Component({
  selector: 'app-checkin',
  imports: [
    NgClass,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatIconButton,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatHint,
    FormsModule,
  ],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.scss',
})
export default class CheckinComponent implements OnInit {
  us: UserService = inject(UserService);
  ds: DialogService = inject(DialogService);
  as: ApiService = inject(ApiService);

  checkinTypeList: CheckinType[] = [];
  selectedCT: CheckinType | null = null;
  validateCheckinType: boolean = false;

  showModal: WritableSignal<boolean> = signal<boolean>(false);
  selectedCheckin: Checkin = new Checkin();
  location: WritableSignal<boolean> = signal<boolean>(false);
  loading: WritableSignal<boolean> = signal<boolean>(false);

  saved: OutputEmitterRef<void> = output();

  ngOnInit(): void {
    this.checkinTypeList = this.checkinTypeOrder(this.us.checkinTypeList());
  }

  checkinTypeOrder(ctList: CheckinType[]): CheckinType[] {
    return ctList.sort((a: CheckinType, b: CheckinType): number => {
      if (a.lastUsed === null && b.lastUsed !== null) {
        return 1;
      }
      if (a.lastUsed !== null && b.lastUsed === null) {
        return -1;
      }
      if (a.lastUsed === null && b.lastUsed === null) {
        if (a.name !== null && b.name !== null) {
          return a.name.localeCompare(b.name);
        } else {
          return 1;
        }
      }

      const dateA: Date | null = Utils.getDateFromString(a.lastUsed);
      const dateB: Date | null = Utils.getDateFromString(b.lastUsed);

      if (dateA !== null && dateB !== null) {
        return dateB.getTime() - dateA.getTime();
      }
      return 1;
    });
  }

  load(): void {
    this.selectedCheckin = new Checkin();
    this.selectedCheckin.idType = this.checkinTypeList[0].id;
    this.selectedCT = this.checkinTypeList[0];
    if (this.location()) {
      this.getCurrentLocation();
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  updateSelectedCT(): void {
    const ind: number = this.checkinTypeList.findIndex(
      (ct: CheckinType): boolean => {
        return ct.id === this.selectedCheckin.idType;
      }
    );
    this.selectedCT = ind !== -1 ? this.checkinTypeList[ind] : null;
  }

  getLocation(): void {
    this.location.update((value: boolean): boolean => !value);
    this.getCurrentLocation();
  }

  getCurrentLocation(): void {
    if (this.location()) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition): void => {
            this.selectedCheckin.locationLat = position.coords.latitude;
            this.selectedCheckin.locationLon = position.coords.longitude;
          },
          (error: GeolocationPositionError): void => {
            console.log(error);
            this.ds
              .alert({
                title: 'Error',
                content: 'Error al obtener la ubicación.',
                ok: 'Continuar',
              })
              .subscribe((): void => {
                this.location.set(false);
              });
          }
        );
      } else {
        this.ds
          .alert({
            title: 'Error',
            content: 'La geolocalización no está disponible en este navegador.',
            ok: 'Continuar',
          })
          .subscribe((): void => {
            this.location.set(false);
          });
      }
    }
  }

  addPhoto(): void {
    const obj: HTMLElement | null = document.getElementById('photo-file');
    if (obj) {
      obj.click();
    }
  }

  onPhotoChange(ev: Event): void {
    const reader: FileReader = new FileReader();
    const files: FileList | null = (<HTMLInputElement>ev.target).files;
    if (files !== null && files.length > 0) {
      const file = files[0];
      reader.readAsDataURL(file);
      reader.onload = (): void => {
        this.selectedCheckin.photo = reader.result as string;
        (<HTMLInputElement>document.getElementById('photo-file')).value = '';
      };
    }
  }

  removePhoto(): void {
    this.selectedCheckin.photo = null;
  }

  checkForm(): void {
    this.validateCheckinType = false;
    if (!this.selectedCheckin.idType) {
      this.validateCheckinType = true;
      return;
    }

    this.loading.set(true);
    this.as
      .saveCheckin(this.selectedCheckin.toInterface())
      .subscribe((result: StatusResult): void => {
        this.loading.set(false);
        if (result.status === 'ok') {
          this.us.checkinTypeList.update(
            (value: CheckinType[]): CheckinType[] => {
              const ind: number = value.findIndex(
                (ct: CheckinType): boolean => {
                  return ct.id === this.selectedCheckin.idType;
                }
              );
              value[ind].num =
                value[ind].num === null ? 1 : (value[ind].num ?? 0) + 1;

              value[ind].lastUsed = Utils.getStringFromDate(new Date());
              return value;
            }
          );
          this.ds
            .alert({
              title: 'Datos guardados',
              content: 'Nuevo checkin guardado.',
              ok: 'Continuar',
            })
            .subscribe((): void => {
              this.closeModal();
              this.saved.emit();
            });
        } else {
          this.ds.alert({
            title: 'Error',
            content: 'Error al guardar el checkin.',
            ok: 'Continuar',
          });
        }
      });
  }
}
