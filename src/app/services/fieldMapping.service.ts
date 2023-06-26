import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FieldMappingService {
    roleList: any;
    uploaded: Subject<boolean> = new Subject<boolean>();
    getUploadStatus = this.uploaded.asObservable();
}
