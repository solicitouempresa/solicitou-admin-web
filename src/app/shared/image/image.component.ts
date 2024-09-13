import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageService } from './services/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  public toFile;
  public create = true;
  public update;
  @Output() evento = new EventEmitter();
  urlImage: string;
  constructor() { }

  @Input()
  set valor(valor) {
    this.urlImage = valor;
  }

  ngOnInit(): void {
  }

  submit() {

    const file = this.toFile.item(0);

    this.evento.emit(file);
    // this.uploadService.fileUpload(file);
    }
   
    onChange(event) {
    this.toFile = event.target.files;

    const reader = new FileReader();
    reader.onload = () => {
      this.urlImage = reader.result as string;
    }
    reader.readAsDataURL(this.toFile.item(0))
    }

}
