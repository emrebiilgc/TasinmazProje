import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import XYZ from 'ol/source/XYZ';
import LayerGroup from 'ol/layer/Group';
import ScaleLine from 'ol/control/ScaleLine';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { defaults as defaultInteractions } from 'ol/interaction';
import { defaults as defaultControls, Zoom } from 'ol/control';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit, AfterViewInit {
  properties: any[] = [];
  allProperties: any[] = [];
  pagedProperties: any[] = [];
  selectedProperties: number[] = [];

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 7;
  totalPages: number = 1;

  gotoPageNumber: number = 1;
  role: string = '';

  map!: Map;
  markerLayer!: VectorLayer<VectorSource>;

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getProperties();
    this.setUserRole();
    this.checkSuccessMessage();
  }

  ngAfterViewInit(): void {
    this.initMap();

    setTimeout(() => {
      const zoomInButton = document.querySelector('button.ol-zoom-in') as HTMLButtonElement;
      const zoomOutButton = document.querySelector('button.ol-zoom-out') as HTMLButtonElement;

      if (zoomInButton && zoomOutButton) {
        [zoomInButton, zoomOutButton].forEach(button => {
          button.style.width = '50px';
          button.style.height = '50px';
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


  checkSuccessMessage(): void {
    const message = sessionStorage.getItem('successMessage');
    if (message) {
      this.alertService.show(message, 3000, true); // 🔁 true yapıyoruz!
      sessionStorage.removeItem('successMessage');
    }
  }


  setUserRole(): void {
    const role = this.authService.getRole();
    if (role) {
      this.role = role;
    }
  }

  getProperties(): void {
    this.propertyService.getAllProperties().subscribe(data => {
      this.allProperties = data;
      this.properties = [...this.allProperties];
      this.updatePagination();
      this.addAllMarkers();
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.properties.length / this.pageSize) || 1;
    this.changePage(this.currentPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedProperties = this.properties.slice(startIndex, endIndex);
  }

  goToPage(): void {
    if (this.gotoPageNumber >= 1 && this.gotoPageNumber <= this.totalPages) {
      this.changePage(this.gotoPageNumber);
    } else {
      this.alertService.show('Geçersiz sayfa numarası!', 3000);
    }
  }

  search(): void {
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      this.properties = this.allProperties.filter(property =>
        property.cityName.toLowerCase().includes(term) ||
        property.districtName.toLowerCase().includes(term) ||
        property.neighborhoodName.toLowerCase().includes(term)
      );
    } else {
      this.properties = [...this.allProperties];
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  onCheckboxChange(propertyId: number, event: any): void {
    if (event.target.checked) {
      this.selectedProperties.push(propertyId);
    } else {
      this.selectedProperties = this.selectedProperties.filter(id => id !== propertyId);
    }
  }

  deleteSelectedProperties(): void {
    if (this.selectedProperties.length === 0) {
      this.alertService.show('Lütfen silmek için bir taşınmaz seçin!', 3000);
      return;
    }

    this.confirmMessage = 'Seçili taşınmazları silmek istediğinize emin misiniz?';
    this.confirmAction = () => {
      let successCount = 0;
      let realErrorCount = 0;

      this.selectedProperties.forEach(id => {
        this.propertyService.deleteProperty(id).subscribe({
          next: () => {
            successCount++;
            finalizeCheck();
          },
          error: (err) => {
            if (err.status !== 404) {
              realErrorCount++;
            }
            finalizeCheck();
          }
        });
      });

      const finalizeCheck = () => {
        if (successCount + realErrorCount === this.selectedProperties.length) {
          if (realErrorCount === 0) {
            this.alertService.show('Silme işlemi başarıyla gerçekleşti!', 3000, true);
          } else {
            this.alertService.show('Bazı taşınmazlar silinemedi.', 3000, false);
          }
          this.selectedProperties = [];
          this.getProperties();
        }
      };
    };

    this.showConfirmModal = true;
  }


  updateSelectedProperty(): void {
    if (this.selectedProperties.length !== 1) {
      this.alertService.show('Lütfen bir taşınmaz seçin!', 3000);
      return;
    }
    const selectedId = this.selectedProperties[0];
    this.router.navigate(['/property-edit', selectedId]);
  }

  exportSelectedPropertyAsExcel(): void {
    if (this.selectedProperties.length === 0) {
      this.alertService.show('Lütfen bir veya daha fazla taşınmaz seçin!', 3000);
      return;
    }

    const selectedProperties = this.properties.filter(p => this.selectedProperties.includes(p.id));

    if (selectedProperties.length === 0) {
      this.alertService.show('Seçili taşınmaz(lar) bulunamadı!', 3000);
      return;
    }

    const cleanedProperties = selectedProperties.map(p => ({
      İl: p.cityName,
      İlçe: p.districtName,
      Mahalle: p.neighborhoodName,
      Ada: p.ada,
      Parsel: p.parsel,
      Nitelik: p.nitelik,
      Adres: p.adres,
      Enlem: p.latitude,
      Boylam: p.longitude
    }));

    const worksheet = XLSX.utils.json_to_sheet(cleanedProperties);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Taşınmazlar');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'tasinmazlar_raporu.xlsx');
  }


  currentOpacity: number = 1;

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


  initMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [this.baseLayers],
      view: new View({
        center: fromLonLat([35.2433, 38.9637]),
        zoom: 6
      }),
      interactions: defaultInteractions({ mouseWheelZoom: false }),
      controls: defaultControls({ attribution: false, zoom: false, rotate: false }).extend([
        new Zoom({
          zoomInLabel: this.createZoomLabel('+'),
          zoomOutLabel: this.createZoomLabel('-')
        }),
        new ScaleLine({
          bar: true,
          text: true,
          units: 'metric',
          target: 'scaleControl',
          minWidth:100,
          dpi: 96
        })
      ])
    });

    this.markerLayer = new VectorLayer({ source: new VectorSource() });
    this.map.addLayer(this.markerLayer);
  }


  private createZoomLabel(symbol: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.innerText = symbol;
    span.style.color = 'black';
    span.style.fontSize = '32px'
    span.style.fontWeight = 'bold';
    span.style.display = 'flex';
    span.style.alignItems = 'center';
    span.style.justifyContent = 'center';
    span.style.width = '100%';
    span.style.height = '100%';
    return span;
  }




  addAllMarkers(): void {
    if (!this.markerLayer) return;
    const source = this.markerLayer.getSource();
    source?.clear();

    for (const property of this.properties) {
      if (property.latitude && property.longitude) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([property.longitude, property.latitude]))
        });
        feature.setStyle(new Style({
          image: new Icon({
            src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            scale: 0.05
          })
        }));
        source?.addFeature(feature);
      }
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.properties = [...this.allProperties];
    this.currentPage = 1;
    this.updatePagination();
  }

  reportAllProperties(): void {
    if (this.allProperties.length === 0) {
      this.alertService.show('Yazdırmak için hiç taşınmaz bulunamadı!', 3000, false);
      return;
    }

    const cleanedProperties = this.allProperties.map(p => ({
      'İl': p.cityName,
      'İlçe': p.districtName,
      'Mahalle': p.neighborhoodName,
      'Ada': p.ada,
      'Parsel': p.parsel,
      'Nitelik': p.nitelik,
      'Adres': p.adres,
      'Enlem': p.latitude,
      'Boylam': p.longitude
    }));

    const worksheet = XLSX.utils.json_to_sheet(cleanedProperties);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TumTasinmazlar');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'tum_tasinmazlar_raporu.xlsx');
  }



}
