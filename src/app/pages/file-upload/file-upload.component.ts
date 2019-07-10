import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase} from '@angular/fire/database';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;

  // State fro dropzone CSS toggling
  isHovering: boolean;

  // State is upload
  hasUpload = false;

  constructor(private db: AngularFireStorage, private rtdb: AngularFireDatabase) { }

  ngOnInit() {
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);

    if (file.type.split('/')[0] !== 'image') {
      console.error('Unsopported type');
      return;
    }

    // The storage path
    const path = `test/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'LoginAngularApp' };

    // The main task
    this.task = this.db.upload(path, file, {customMetadata});

    // When task upload save to real time db
    this.task.then(snap => {
      if (snap.bytesTransferred === snap.totalBytes && !this.hasUpload) {
          this.db.ref(path).getDownloadURL().subscribe(Url => {
            console.log(snap);
            console.log(Url);
            // Update firestore on completed
            const itemsRef = this.rtdb.list('photos');
            itemsRef.push({ url: Url , size: snap.totalBytes });
          });
          this.hasUpload = true;
        }
    });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();

    // The file's download URL
    this.snapshot.pipe(finalize(() => this.downloadURL = this.db.ref(path).getDownloadURL())).subscribe();

  }

  // Determinates if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalByte;
  }


}
