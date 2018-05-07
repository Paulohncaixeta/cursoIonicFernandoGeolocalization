import { Component } from '@angular/core';
import { Geolocation} from '@ionic-native/geolocation';
import { NavController, Platform, AlertController } from 'ionic-angular';

declare var google : any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mapa: any;
  latitude: any;
  longitude: any;

  constructor(public navCtrl: NavController,
              public geolocatioin: Geolocation,
              private alertCtrl: AlertController,
              public platform: Platform) {
                platform.ready().then(()=>{
                  this.obterPosicao();
                });
  }

  obterPosicao():any{
    this.geolocatioin.getCurrentPosition()
      .then(res=> {
        this.latitude = res.coords.latitude;
        this.longitude = res.coords.longitude;
        this.loadMap();
      })
      .catch(
        (error) => {
          console.log(error.message);
          this.latitude = -18.3768;
          this.longitude = -46.0325;
          this.loadMap();
        }
      )
  }

  loadMap(){
    
    let mapContainer = document.getElementById('map');

    this.mapa = new google.maps.Map(
        mapContainer,
        {center: new google.maps.LatLng(
                    this.latitude,
                    this.longitude),
                    zoom : 14});
                  
    let marcador = new google.maps.Marker({
        icon: 'assets/imgs/iconeAqui.png',
        map: this.mapa,
        position: new google.maps.LatLng(
                    this.latitude,
                    this.longitude)
        
    });
    
  }

}
