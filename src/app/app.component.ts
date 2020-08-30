import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  imageUrl: string = '';
  message: string = '';
  size: number;
  text: string = '';
  format: string = '';
  bgcolor: string = '';
  color: string = '';
  isGenerated: boolean = false;

  constructor() {}

  buttonGenerate() {
    if (this.text === '') {
      this.message = 'Please enter the text';
      this.isGenerated = false;
    } else if (this.size < 50 || this.size > 1000 || isNaN(this.size)) {
      this.message = 'Size should be number between 50 to 1000';
      this.isGenerated = false;
    } else {
      this.imageUrl =
        'http://api.qrserver.com/v1/create-qr-code/?size=' +
        this.size +
        'x' +
        this.size +
        '&data=' +
        this.text +
        '&format=' +
        this.format +
        '&bgcolor=' +
        this.bgcolor +
        '&color=' +
        this.color;
      this.message = '';
      this.isGenerated = true;
    }
  }
}
