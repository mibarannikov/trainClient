import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {catchError, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {TrainInfoService} from "../../../../service/train-info.service";
import {Station} from "../../../../models/station";
import {StationService} from "../../../../service/station.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  options: google.maps.MapOptions = {
    center: {lat: 40, lng: -20},
    zoom: 4
  };
  apiLoaded: Observable<boolean>;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPosition: google.maps.LatLngLiteral;
  arr: google.maps.LatLngLiteral[][] = [];
  vertices: google.maps.LatLngLiteral[] = [
    {lat: 13, lng: 13},
    {lat: -13, lng: 0},
  ];
  ver1: google.maps.LatLngLiteral[] = [
    {lat: 13, lng: 13},
    {lat: 0, lng: -13},
  ];

  stations: Station[];

  constructor(public trainInfoService: TrainInfoService,
              private dialog: MatDialogRef<MapComponent>,
              private httpClient: HttpClient,
              private stationService: StationService,
              // @ts-ignore
              @Inject(MAT_DIALOG_DATA) public data) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyAv5qFDLP4kuuwF-uWzVlq9BFjJtTjCg_w', 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  ngOnInit(): void {
    this.stationService.getStations().subscribe(data => {
      this.stations = data;
      console.log('st',data)
      for (let st of this.stations) {
        console.log(st)
        for(let cSt of st.canGetStation){
           console.log('cSt ',cSt)
           let canGet = this.stations.find(s=>s.nameStation===cSt);
           console.log(canGet)
           // @ts-ignore
           this.arr.push([{lat:st.latitude, lng: st.longitude},{lat:canGet.latitude,lng:canGet.longitude }]);
         }

      }
    });

    // this.arr[0] = this.vertices;
    //
    // this.arr[1] = this.ver1;
    console.log('fffffffffffff', this.data)
    this.options = {
      center: {lat: this.data.lat, lng: this.data.lng},
      zoom: 8
    };
    this.markerPosition = {lat: this.data.lat, lng: this.data.lng};
  }

  go(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    console.log(event.latLng?.lat());
    // @ts-ignore
    this.markerPosition = event.latLng.toJSON();
  }


  close() {
    this.trainInfoService.lonForEdit = this.markerPosition.lng;
    this.trainInfoService.latForEdit = this.markerPosition.lat;
    this.dialog.close({lat: this.markerPosition.lat, lng: this.markerPosition.lng});

  }

  cancel() {

    this.dialog.close(); //{lat: this.data.lat, lng: this.data.lng}
  }
}
