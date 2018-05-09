import { Component } from '@angular/core';
import { Geolocation} from '@ionic-native/geolocation';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { GeoAulaProvider } from '../../providers/geo-aula/geo-aula';

declare var google : any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mapa: any;
  latitude: any;
  longitude: any;
  enderecoPosicao: "";

  latitudeDestino: 0;
  longitudeDestino: 0;
  enderecoDestino: any = "";

  constructor(public navCtrl: NavController,
              public geolocatioin: Geolocation,
              private alertCtrl: AlertController,
              public platform: Platform,
              public geoAulaProvider: GeoAulaProvider) {
                platform.ready().then(()=>{
                  this.obterPosicao();
                });
  }

  obterPosicao():any{
    this.geolocatioin.getCurrentPosition()
      .then(res=> {
        this.latitude = res.coords.latitude;
        this.longitude = res.coords.longitude;
        this.latitude = -18.5742094;
        this.longitude = -46.513054499999996;
        this.buscarEnderecoPorCoordenadas();
        this.loadMap();
      })
      .catch(
        (error) => {
          console.log(error.message);
          this.latitude = -18.5742094;
          this.longitude = -46.513054499999996;
          this.buscarEnderecoPorCoordenadas();
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
    if(this.latitudeDestino !=0)
      {
        let marcador2 = new google.maps.Marker({
          icon: 'assets/imgs/iconeAqui.png',
          map: this.mapa,
          position: new google.maps.LatLng(
                      this.latitudeDestino,
                      this.longitudeDestino)
        });
      }
    
  }

  buscarEnderecoPorCoordenadas(){
   
    this.geoAulaProvider.buscarEndereco(this.latitude,
                                        this.longitude)
                                        .then ( retorno =>
      {
        
        console.log(retorno);
        this.enderecoPosicao = retorno;
        
      });
  }

  novoLugar(){
    
    this.enderecoDestino = "Rua Padre Caldeira, 231, Patos de Minas, MG"
    this.geoAulaProvider.buscarCoordenadas(this.enderecoDestino)
      .then (retorno => {
        this.latitudeDestino = retorno[0].geometry.location.lat();
        this.longitudeDestino = retorno[0].geometry.location.lng();
        this.loadMap();
      });
  }

  rota(){
    if (this.latitudeDestino !=0){
      let diretionsService = new google.maps.diretionsService();
      let diretionsDisplay = new google.maps.diretionsDisplay();

      let startPosition = new google.maps.LatLng(
          this.latitude,
          this.longitude
      );

      const mapOptions = {
        zoom:18,
        center: startPosition,
        disableDefaultUI: true
      };

      this.mapa = new google.maps.Map(document.getElementById('map'),
      mapOptions);
      diretionsDisplay.setMap(this.mapa);

      const marker = new google.maps.Marker({
        position: startPosition,
        map: this.mapa,
      });
      
      const request = {
        origin: new google.maps.LatLng(this.latitude, this.longitude),
          destination: new google.maps.LatLng(this.latitudeDestino, this.longitudeDestino),
          travelMode: 'DRIVING'
      };

      diretionsService.route(request, (result, status) => {
        if (status == 'ok') {
          diretionsDisplay.setDirections(result);
        }
      });
    }
  }

}
