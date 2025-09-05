import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { CityService } from '../../services/city.service';
import { DistrictService } from '../../services/district.service';
import { NeighborhoodService } from '../../services/neighborhood.service';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { AlertService } from '../../services/alert.service';
import { defaults as defaultInteractions, MouseWheelZoom } from 'ol/interaction';
import { Zoom } from 'ol/control';



import XYZ from 'ol/source/XYZ';
import LayerGroup from 'ol/layer/Group';
import ScaleLine from 'ol/control/ScaleLine';
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
import {defaults as defaultControls} from "ol/control/defaults";

@Component({
  selector: 'app-property-add',
  templateUrl: './property-add.component.html',
  styleUrls: ['./property-add.component.scss']
})
export class PropertyAddComponent implements OnInit, AfterViewInit {
  cities: any[] = [];
  districts: any[] = [];
  neighborhoods: any[] = [];

  selectedCityId: number | null = null;
  selectedDistrictId: number | null = null;
  selectedNeighborhoodId: number | null = null;

  ada: any = '';
  parsel: any = '';
  nitelik: string = '';
  adres: string = '';
  userRole: string | null = null;
  errorFields: { [key: string]: boolean } = {};

  latitude: number = 0;
  longitude: number = 0;
  map!: Map;
  markerLayer!: VectorLayer<VectorSource>;

  constructor(
    private propertyService: PropertyService,
    private cityService: CityService,
    private districtService: DistrictService,
    private neighborhoodService: NeighborhoodService,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadCities();
    this.userRole = this.authService.getRole();
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

  loadCities(): void {
    this.cityService.getCities().subscribe(data => {
      this.cities = data.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  onCityChange(): void {
    if (this.selectedCityId) {
      this.districtService.getDistricts(this.selectedCityId).subscribe(data => {
        this.districts = data.sort((a, b) => a.name.localeCompare(b.name));
        this.neighborhoods = [];
        this.selectedDistrictId = null;
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
        scale: 0.05
      })
    }));

    this.markerLayer.getSource()?.addFeature(marker);
  }

  validateAllFields(): boolean {
    this.errorFields = {};

    if (!this.selectedCityId) this.errorFields['city'] = true;
    if (!this.selectedDistrictId) this.errorFields['district'] = true;
    if (!this.selectedNeighborhoodId) this.errorFields['neighborhood'] = true;
    if (this.ada === '' || isNaN(Number(this.ada)) || !Number.isInteger(Number(this.ada))) this.errorFields['ada'] = true;
    if (this.parsel === '' || isNaN(Number(this.parsel)) || !Number.isInteger(Number(this.parsel))) this.errorFields['parsel'] = true;
    if (!this.nitelik.trim()) this.errorFields['nitelik'] = true;
    if (!this.adres.trim()) this.errorFields['adres'] = true;

    if (this.latitude === 0 || this.longitude === 0) {
      this.errorFields['latitude'] = true;
      this.errorFields['longitude'] = true;
    }

    return Object.keys(this.errorFields).length === 0;
  }



  addProperty(): void {
    if (!this.validateAllFields()) {
      this.alertService.show('Lütfen eksik alanları düzeltin!', 3000);
      return;
    }

    this.confirmMessage = 'Yeni taşınmazı eklemek istediğinize emin misiniz?';
    this.confirmAction = () => {
      const newProperty = {
        cityId: this.selectedCityId,
        districtId: this.selectedDistrictId,
        neighborhoodId: this.selectedNeighborhoodId,
        ada: Number(this.ada),
        parsel: Number(this.parsel),
        nitelik: this.nitelik.trim(),
        adres: this.adres.trim(),
        latitude: this.latitude,
        longitude: this.longitude,
        title: 'Yeni Taşınmaz',
        description: 'Açıklama'
      };

      this.propertyService.addProperty(newProperty).subscribe({
        next: () => {
          sessionStorage.setItem('successMessage', 'Yeni taşınmaz başarıyla eklendi!');
          this.router.navigate(['/property-list']);
        },
        error: () => {
          this.alertService.show('Bir hata oluştu!', 3000);
        }
      });
    };

    this.showConfirmModal = true;
  }


  showConfirmModal = false;
  confirmMessage = '';
  confirmAction: () => void = () => {};

  logout(): void {
    this.confirmMessage = 'Çıkış yapmak istediğinize emin misiniz?';
    this.confirmAction = () => {
      this.authService.logout();
    };
    this.showConfirmModal = true;
  }

  private createZoomLabel(symbol: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.innerText = symbol;
    span.style.color = 'black';
    span.style.fontSize = '25px'
    span.style.fontWeight = 'bold';
    span.style.display = 'flex';
    span.style.alignItems = 'center';
    span.style.justifyContent = 'center';
    span.style.width = '100%';
    span.style.height = '100%';
    return span;
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
