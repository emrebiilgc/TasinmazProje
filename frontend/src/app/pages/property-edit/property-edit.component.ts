import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { CityService } from '../../services/city.service';
import { DistrictService } from '../../services/district.service';
import { NeighborhoodService } from '../../services/neighborhood.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { firstValueFrom } from 'rxjs';

import { defaults as defaultInteractions } from 'ol/interaction';
import { Zoom } from 'ol/control';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from "ol/source/XYZ";
import LayerGroup from "ol/layer/Group";
import {defaults as defaultControls} from "ol/control/defaults";
import ScaleLine from "ol/control/ScaleLine";

@Component({
  selector: 'app-property-edit',
  templateUrl: './property-edit.component.html',
  styleUrls: ['./property-edit.component.scss']
})
export class PropertyEditComponent implements OnInit, AfterViewInit {
  propertyId!: number;
  cities: any[] = [];
  districts: any[] = [];
  neighborhoods: any[] = [];

  selectedCityId: number | null = null;
  selectedDistrictId: number | null = null;
  selectedNeighborhoodId: number | null = null;

  ada: string = '';
  parsel: string = '';
  nitelik: string = '';
  adres: string = '';

  latitude: number = 0;
  longitude: number = 0;

  map!: Map;
  markerLayer!: VectorLayer<VectorSource>;

  userRole: string | null = null;
  errorFields: { [key: string]: boolean } = {};

  showConfirmModal = false;
  confirmMessage = '';
  confirmAction: () => void = () => {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private cityService: CityService,
    private districtService: DistrictService,
    private neighborhoodService: NeighborhoodService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userRole = this.authService.getRole();
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));

    const property = await firstValueFrom(this.propertyService.getPropertyById(this.propertyId));

    this.ada = property.ada;
    this.parsel = property.parsel;
    this.nitelik = property.nitelik;
    this.adres = property.adres;
    this.latitude = property.latitude || 0;
    this.longitude = property.longitude || 0;

    this.cities = (await firstValueFrom(this.cityService.getCities())).sort((a, b) => a.name.localeCompare(b.name));
    this.selectedCityId = property.cityId;

    if (this.selectedCityId) {
      this.districts = (await firstValueFrom(this.districtService.getDistricts(this.selectedCityId))).sort((a, b) => a.name.localeCompare(b.name));
      this.selectedDistrictId = property.districtId;

      if (this.selectedDistrictId) {
        this.neighborhoods = (await firstValueFrom(this.neighborhoodService.getNeighborhoods(this.selectedDistrictId))).sort((a, b) => a.name.localeCompare(b.name));
        this.selectedNeighborhoodId = property.neighborhoodId;
      }
    }

    setTimeout(() => {
      if (this.map && this.latitude !== 0 && this.longitude !== 0) {
        const coord = fromLonLat([this.longitude, this.latitude]);
        this.addMarker(coord);
      }
    }, 1000);
  }


  ngAfterViewInit(): void {
    this.initializeMap();

    setTimeout(() => {
      const zoomInButton = document.querySelector('button.ol-zoom-in') as HTMLButtonElement;
      const zoomOutButton = document.querySelector('button.ol-zoom-out') as HTMLButtonElement;

      if (zoomInButton && zoomOutButton) {
        [zoomInButton, zoomOutButton].forEach(button => {
          button.style.width = '35px';
          button.style.height = '35px';
          button.style.background = 'white';
          button.style.border = 'none';
          button.style.borderRadius = '0';
          button.style.boxShadow = '0 8px 16px rgba(0,0,0,0.4)';
          button.style.transition = 'all 0.3s ease';
          button.style.cursor = 'pointer';
        });


      }
    }, 100);



  }



  initializeMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [this.baseLayers],
      controls: defaultControls({ attribution: false, rotate: false, zoom: false }).extend([
        new Zoom({
          zoomInLabel: this.createZoomLabel('+'),
          zoomOutLabel: this.createZoomLabel('-')
        }),
        new ScaleLine({
          bar: true,
          text: true,
          units: 'metric',
          minWidth: 100,
          target: 'scaleControl'
        })
      ]),
      interactions: defaultInteractions({ mouseWheelZoom: false }),
      view: new View({
        center: fromLonLat([35.2433, 38.9637]),
        zoom: 6
      })
    });

    this.markerLayer = new VectorLayer({ source: new VectorSource() });
    this.map.addLayer(this.markerLayer);

    this.map.on('click', (event) => {
      const coords = toLonLat(event.coordinate);
      this.latitude = coords[1];
      this.longitude = coords[0];
      this.addMarker(event.coordinate);
    });
  }


  addMarker(coord: any): void {
    this.markerLayer.getSource()?.clear();

    const marker = new Feature({
      geometry: new Point(coord)
    });

    marker.setStyle(new Style({
      image: new Icon({
        src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        scale: 0.06
      })
    }));

    this.markerLayer.getSource()?.addFeature(marker);
  }

  onCityChange(): void {
    if (this.selectedCityId) {
      this.districtService.getDistricts(this.selectedCityId).subscribe(data => {
        this.districts = data.sort((a, b) => a.name.localeCompare(b.name));
        this.selectedDistrictId = null;
        this.neighborhoods = [];
        this.selectedNeighborhoodId = null;
      });
    }
  }

  onDistrictChange(): void {
    if (this.selectedDistrictId) {
      this.neighborhoodService.getNeighborhoods(this.selectedDistrictId).subscribe(data => {
        this.neighborhoods = data.sort((a, b) => a.name.localeCompare(b.name));
        this.selectedNeighborhoodId = null;
      });
    }
  }

  updateProperty(): void {
    const adaNumber = Number(this.ada);
    const parselNumber = Number(this.parsel);

    this.errorFields = {};

    if (!this.selectedCityId) this.errorFields['city'] = true;
    if (!this.selectedDistrictId) this.errorFields['district'] = true;
    if (!this.selectedNeighborhoodId) this.errorFields['neighborhood'] = true;
    if (!this.nitelik.trim()) this.errorFields['nitelik'] = true;
    if (!this.adres.trim()) this.errorFields['adres'] = true;
    if (this.ada === '' || isNaN(adaNumber) || !Number.isInteger(adaNumber)) this.errorFields['ada'] = true;
    if (this.parsel === '' || isNaN(parselNumber) || !Number.isInteger(parselNumber)) this.errorFields['parsel'] = true;
    if (this.latitude === 0 || this.longitude === 0) {
      this.errorFields['latitude'] = true;
      this.errorFields['longitude'] = true;
    }

    if (Object.keys(this.errorFields).length > 0) {
      this.alertService.show('Lütfen eksik veya hatalı alanları düzeltin!', 3000);
      return;
    }

    const updatedProperty = {
      id: this.propertyId,
      cityId: this.selectedCityId,
      districtId: this.selectedDistrictId,
      neighborhoodId: this.selectedNeighborhoodId,
      ada: adaNumber,
      parsel: parselNumber,
      nitelik: this.nitelik.trim(),
      adres: this.adres.trim(),
      latitude: this.latitude,
      longitude: this.longitude,
      title: 'Güncellenmiş Taşınmaz',
      description: 'Güncelleme Açıklaması'
    };

    this.confirmMessage = 'Seçili taşınmaza ait bilgileri güncellemek istediğinize emin misiniz?';
    this.confirmAction = () => {
      this.propertyService.updateProperty(updatedProperty).subscribe({
        next: () => {
          sessionStorage.setItem('successMessage', 'Seçili taşınmaza ait güncelleme başarıyla gerçekleşti.');
          this.router.navigate(['/property-list']);
        },
        error: () => {
          this.alertService.show('Güncelleme sırasında bir hata oluştu!', 3000);
        }
      });
    };

    this.showConfirmModal = true;
  }



  private createZoomLabel(symbol: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.innerText = symbol;
    span.style.color = 'black';
    span.style.fontSize = '25px';
    span.style.fontWeight = 'bold';
    span.style.display = 'flex';
    span.style.alignItems = 'center';
    span.style.justifyContent = 'center';
    span.style.width = '100%';
    span.style.height = '100%';
    return span;
  }



  logout(): void {
    this.confirmMessage = 'Çıkış yapmak istediğinize emin misiniz?';
    this.confirmAction = () => {
      this.authService.logout();
    };
    this.showConfirmModal = true;
  }

  onLayerChange(event: any): void {
    const selected = event.target.value;
    this.osmLayer.setVisible(selected === 'osm');
    this.googleLayer.setVisible(selected === 'google');
  }

  onOpacityChange(event: any): void {
    const value = parseFloat(event.target.value);
    this.osmLayer.setOpacity(value);
    this.googleLayer.setOpacity(value);
    this.currentOpacity = value;
  }

  osmLayer = new TileLayer({ source: new OSM(), visible: true });
  googleLayer = new TileLayer({
    source: new XYZ({
      url: 'http://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}'
    }),
    visible: false,
    opacity: 1
  });
  baseLayers = new LayerGroup({
    layers: [this.osmLayer, this.googleLayer]
  });
  currentOpacity: number = 1;
}
