import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item-model';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private IMAGES_FOLDER = 'profileImgs';

  constructor( private db: AngularFirestore) { }

  private saveImg( image: any ) {
  }

  setImagesFirestore( fileImg: FileItem) {
    console.log(fileImg);
  }
}
