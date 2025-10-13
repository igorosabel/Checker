import { Component, OnInit, Signal, inject, viewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatActionList,
  MatListItem,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle,
} from '@angular/material/list';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import {
  CheckinsFiltersInterface,
  CheckinsResult,
} from '@interfaces/checkins.interfaces';
import { Checkin } from '@model/checkin.model';
import { CheckinType } from '@model/checkintype.model';
import { ApiService } from '@services/api.service';
import { ClassMapperService } from '@services/class-mapper.service';
import { UserService } from '@services/user.service';
import CheckinDetailComponent from '@shared/components/checkin-detail/checkin-detail.component';
import CheckinsFiltersComponent from '@shared/components/checkins-filters/checkins-filters.component';
import FooterComponent from '@shared/components/footer/footer.component';
import HeaderComponent from '@shared/components/header/header.component';
import MenuComponent from '@shared/components/menu/menu.component';
import { Feature } from 'ol';
import { FeatureLike } from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import { Coordinate } from 'ol/coordinate';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';

@Component({
  selector: 'app-map',
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatIconButton,
    MatIcon,
    MatActionList,
    MatListItem,
    MatListItemTitle,
    MatListItemLine,
    MatListItemMeta,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    CheckinsFiltersComponent,
    CheckinDetailComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export default class MapComponent implements OnInit {
  as: ApiService = inject(ApiService);
  cms: ClassMapperService = inject(ClassMapperService);
  us: UserService = inject(UserService);

  map: Map | null = null;
  mapView: View = new View({
    center: [0, 0],
    zoom: 11,
  });
  markerLayer = new VectorLayer({
    source: new VectorSource(),
  });

  opened: boolean = false;
  sidenav: Signal<MatSidenav> = viewChild.required('sidenav');
  abecedario: string[] = [];
  lastChar: number = 0;
  filters: Signal<CheckinsFiltersComponent> =
    viewChild.required<CheckinsFiltersComponent>('filters');
  checkinFilters: CheckinsFiltersInterface = {
    idType: null,
    start: null,
    end: null,
    page: 1,
  };
  total: number = 0;
  detail: Signal<CheckinDetailComponent> =
    viewChild.required<CheckinDetailComponent>('detail');

  checkinTypes: CheckinType[] = [];
  checkins: Checkin[] = [];

  ngOnInit(): void {
    const primeraLetra: number = 'a'.charCodeAt(0);
    const ultimaLetra: number = 'z'.charCodeAt(0);

    for (let codigo: number = primeraLetra; codigo <= ultimaLetra; codigo++) {
      const letra: string = String.fromCharCode(codigo).toUpperCase();
      this.abecedario.push(letra);
    }
    this.checkinTypes = this.us.checkinTypeList();
    this.loadCheckins();
  }

  initializeMap(latCenter: number, lonCenter: number): void {
    // Coordenadas del centro del mapa
    const centerCoordinates: Coordinate = fromLonLat([lonCenter, latCenter]);

    // Capa de mapa base (OSM)
    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    // Capa vectorial para los marcadores
    this.markerLayer = new VectorLayer({
      source: new VectorSource(),
    });

    this.map = new Map({
      target: 'map',
      layers: [baseLayer, this.markerLayer],
      view: this.mapView,
    });
    this.mapView.setCenter(centerCoordinates);

    this.map.on('singleclick', (evt): void => {
      const feature: FeatureLike | undefined = this.map?.forEachFeatureAtPixel(
        evt.pixel,
        (feat: FeatureLike): FeatureLike => {
          return feat;
        }
      );
      if (feature) {
        const id: number = feature.get('checkin-id');
        const c: Checkin | undefined = this.checkins.find(
          (c: Checkin): boolean => {
            return c.id === id;
          }
        );
        if (c !== undefined) {
          this.openDetail(c);
        }
      }
    });

    for (const c of this.checkins) {
      if (c.locationLat !== null && c.locationLon !== null) {
        this.addMarker(c);
      }
    }
  }

  addMarker(c: Checkin): void {
    // Coordenadas del marcador
    const markerCoordinates: Coordinate = fromLonLat([
      c.locationLon!,
      c.locationLat!,
    ]);
    const markerFeature = new Feature({
      geometry: new Point(markerCoordinates),
    });
    // Añadir el marcador a la capa vectorial
    if (this.markerLayer !== null) {
      this.markerLayer.getSource()?.addFeature(markerFeature);
    }

    // Estilo del marcador
    const markerStyle = new Style({
      image: new Icon({
        src: '/img/pin.svg', // Ruta de la imagen de la chincheta
        scale: 1, // Escala del marcador
      }),
      text: new Text({
        text: c.letter!, // Letra del marcador
        font: 'bold 12px sans-serif', // Fuente y tamaño de la letra
        fill: new Fill({ color: 'black' }), // Color del texto
        offsetY: -2,
        offsetX: -1,
      }),
    });

    // Aplicar el estilo al marcador
    markerFeature.setStyle(markerStyle);
    markerFeature.set('checkin-id', c.id);
  }

  loadCheckins(): void {
    this.as
      .getCheckins(this.checkinFilters)
      .subscribe((result: CheckinsResult): void => {
        const checkins: Checkin[] = this.cms.getCheckins(result.list);
        for (const c of checkins) {
          const ind: number = this.checkinTypes.findIndex(
            (ct: CheckinType): boolean => {
              return ct.id === c.idType;
            }
          );
          c.ct = this.checkinTypes[ind];
          if (c.locationLat !== null && c.locationLon !== null) {
            c.letter = this.getLetter();
          }
        }
        this.checkins = [...this.checkins, ...checkins];
        this.total = result.total;
        this.updateMap();
      });
  }

  getLetter(): string {
    let resultado: string = '';
    let temp: number = this.lastChar;

    do {
      resultado = this.abecedario[temp % 26] + resultado;
      temp = Math.floor(temp / 26) - 1;
    } while (temp >= 0);

    this.lastChar++;

    return resultado;
  }

  updateMap(): void {
    let latCenter: number = 0;
    let lonCenter: number = 0;
    let num: number = 0;
    for (const c of this.checkins) {
      if (c.locationLat !== null && c.locationLon !== null) {
        latCenter += c.locationLat;
        lonCenter += c.locationLon;
        num++;
      }
    }
    latCenter = latCenter / num;
    lonCenter = lonCenter / num;

    this.initializeMap(latCenter, lonCenter);
  }

  showFilters(): void {
    this.filters().open();
  }

  showMenu(): void {
    this.sidenav().toggle();
  }

  openDetail(c: Checkin): void {
    if (c.locationLat !== null && c.locationLon) {
      const centerCoordinates: Coordinate = fromLonLat([
        c.locationLon,
        c.locationLat,
      ]);
      this.mapView.animate({
        center: centerCoordinates,
        duration: 2000,
        zoom: 18,
      });
    }
    this.detail().load(c);
  }

  nextPage(): void {
    this.checkinFilters.page++;
    this.loadCheckins();
  }

  filtersChanged(newFilters: CheckinsFiltersInterface): void {
    this.checkinFilters.idType = newFilters.idType;
    this.checkinFilters.start = newFilters.start;
    this.checkinFilters.end = newFilters.end;
    this.reloadCheckins();
  }

  reloadCheckins(): void {
    this.checkinFilters.page = 1;
    this.checkins = [];
    this.loadCheckins();
  }
}
