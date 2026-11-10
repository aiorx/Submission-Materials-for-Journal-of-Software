var Component = require('@angular/core').Component;
var NavController = require('ionic-angular').NavController;
var AlertController = require('ionic-angular').AlertController;
var DomSanitizer = require('@angular/platform-browser').DomSanitizer;
var Camera = require('@ionic-native/camera').Camera;
var CameraOptions = require('@ionic-native/camera').CameraOptions;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
class HomePage {

  private image: string;

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    public alertCtrl: AlertController,
    private domSanitizer: DomSanitizer) {
  }

  onTakePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: true,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(function (imageData) {
      this.image = 'data:image/jpeg;base64,' + imageData;
      }, function (err) {
        this.displayErrorAlert(err);
      });
  }

  displayErrorAlert(err){
    console.log(err);
    let alert = this.alertCtrl.create({
       title: 'Error',
       subTitle: 'Error while trying to capture picture',
       buttons: ['OK']
     });
     alert.present();
  }

}
