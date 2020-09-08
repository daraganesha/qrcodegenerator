import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  imageViewURL: string = ''; //URL von dem zu zeigenden Bild, es hat Max Size 300px.
  imageDownloadURL: string = ''; //URL vom herunterzuladenden Bild, kann von 50px bis 1000px groß sein.
  errorMessage: string = '';
  message: string = '';
  sizeAsText: string = '';
  generatedSizeAsText: string = '';
  size: number;
  text: string = '';
  generatedText: string = '';
  format: string = 'jpeg';
  generatedFormat: string = '';
  bgcolor: string = '#FFFFFF';
  bgcolorURL: string = '';
  color: string = '';
  colorURL: string = '';
  isGenerated: boolean = false;

  constructor(private http: HttpClient) {}

  setFormat(f: string) {
    this.format = f;
  }

  setSize(s: string) {
    this.sizeAsText = s;
  }

  getUrl(
    size: number,
    text: string,
    format: string,
    bgcolor: string,
    color: string
  ) {
    var url: string;
    url =
      'http://api.qrserver.com/v1/create-qr-code/?size=' +
      size +
      'x' +
      size +
      '&data=' +
      text +
      '&format=' +
      format +
      '&bgcolor=' +
      bgcolor +
      '&color=' +
      color;
    return url;
  }

  generateButton() {
    this.imageViewURL = '';
    this.imageDownloadURL = '';
    this.message = '';
    this.errorMessage = '';
    if (this.text === '') this.errorMessage += 'Please enter the text. '; //falsche Eingabe: kein Text
    if (/^\d+$/.test(this.sizeAsText)) {
      this.size = parseInt(this.sizeAsText);
      this.generatedSizeAsText = this.sizeAsText;
      this.generatedText = this.text;
      this.generatedFormat = this.format;
      /*Format zum Attribute color in <input> ist mit #, in URL ohne # */
      if (this.bgcolor.includes('#'))
        this.bgcolorURL = this.bgcolor.substring(1);
      if (this.color.includes('#')) this.colorURL = this.color.substring(1);
      if (this.size < 50 || this.size > 1000)
        //falsche Eingabe: Größe falsch oder nicht im angegebenen Zahlenraum
        this.errorMessage += 'Size should be numbers between 50 and 1000.';
      if (this.text != '' && this.size >= 50 && this.size <= 1000) {
        this.errorMessage = '';
        this.imageDownloadURL = this.getUrl(
          this.size,
          this.text,
          this.format,
          this.bgcolorURL,
          this.colorURL
        );
        /*Bei angeforderten Größen von mehr als 300x300px wird nur Bild im Größen 300x300px angezeigt. Zum Herunterladen steht das Bild im gewünschten Größe zur Verfügung */
        if (this.size <= 300) {
          this.imageViewURL = this.imageDownloadURL;
        } else {
          this.message =
            'The QR Code is only displayed at a size of 300px but it will be downloaded at a size of ' +
            this.size +
            'px.';
          this.imageViewURL = this.getUrl(
            300,
            this.text,
            this.format,
            this.bgcolorURL,
            this.colorURL
          );
        }
        this.isGenerated = true;
      }
    } else this.errorMessage += 'Size should be numbers between 50 and 1000';
  }

  downloadQRCode() {
    /*Überprüfe, ob es noch Änderungen gibt vorm letzten Generieren. */
    if (
      this.isGenerated &&
      this.generatedText === this.text &&
      this.generatedFormat === this.format &&
      this.generatedSizeAsText === this.sizeAsText
    ) {
      //falls nicht, dann herunterladen
      this.http.get(this.imageDownloadURL, { responseType: 'blob' }).subscribe(
        (data) => {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(data);
          link.download = 'QRCode' + this.text.substring(0, 10);
          link.click();
        },
        (error) => {
          this.errorMessage = 'Unknown Error from Server: ' + error.message;
        }
      );
    } else {
      //andernfalls wird nichts heruntergeladen
      this.message = 'Some changes occur. Please generate before downloading.';
    }
  }

  /*zurück zum Anfangszustand */
  refreshButton() {
    this.imageViewURL = '';
    this.imageDownloadURL = '';
    this.errorMessage = '';
    this.message = '';
    this.sizeAsText = '';
    this.generatedFormat = '';
    this.generatedSizeAsText = '';
    this.generatedText = '';
    this.size;
    this.text = '';
    this.format = 'jpeg';
    this.bgcolor = '#FFFFFF';
    this.bgcolorURL = '';
    this.color = '';
    this.colorURL = '';
    this.isGenerated = false;
  }
}
