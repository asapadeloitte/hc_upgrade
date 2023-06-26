import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HumanCapitalService } from '../../services/humanCapital.service';
import { HttpEventType, HttpEvent, HttpResponse } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../../services/auth.service';
import { FieldMappingService } from '../../services/fieldMapping.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() screenName;
  @Input() header;
  @Input() warningMessage;
  @Input() fileType;
  @Input() year;
  @Input() title;
  @Input() bodyFileType;
  @Output() successEvent = new EventEmitter<boolean>();
  fileToUpload: File;
  files: any[] = [];
  public uploadErrorDetails = [];
  public errorAll = [];
  roleList: string;
  constructor(
    private bsModalRef: BsModalRef,
    private humanCapitalService: HumanCapitalService,
    private authService: AuthService,
    private fieldMappingService: FieldMappingService) { }

  ngOnInit() {
    this.roleList = this.authService.jwt_getRole();
  }

  onFileDropped($event) {
    this.processFiles($event);
  }

  fileBrowseHandler(files) {
    this.processFiles(files);
  }

  processFiles(files: Array<File>) {
    for (const item of files) {
      // ignore empty files
      if (item.size > 0) {
        this.files.push(item);
      }
    }
    this.uploadFile(this.files[this.files.length - 1]);
  }
  uploadFile(file: any) {
    const userId = localStorage.getItem('UserID');
    const userName = localStorage.getItem('UserName');
    file.progress = 0;
    this.fileToUpload = this.files[this.files.length - 1];
    if (this.screenName === 'EHCM') {
      this.humanCapitalService.uploadFileEHCM(this.fileToUpload, this.year).subscribe((event: HttpEvent<any>) => {
        this.eventHandler(event, file);
      }, (error) => {
        this.uploadErrorDetails = error.error.errorDetails;
      });
    } else if (this.screenName === 'HREPS') {
      this.humanCapitalService.uploadFileHREPS(this.fileToUpload, this.year).subscribe((event: HttpEvent<any>) => {
        this.eventHandler(event, file);
      }, (error) => {
        this.uploadErrorDetails = error.error.errorDetails;
      });
    } else if (this.screenName === 'HC_FiledMapping') {
      this.humanCapitalService.hcUploadFieldMapping(this.fileToUpload).subscribe((event: HttpEvent<any>) => {
        this.eventHandler(event, file);
      }, (error) => {
          this.uploadErrorDetails = error.error.errorDetails;
        }, () => {
          console.log('Upload done');
        });
      }
    }
  eventHandler(event, file: any) {
    switch (event.type) {
      case HttpEventType.Sent:
        break;
      case HttpEventType.ResponseHeader:
        if (event.status === 200) {
          file.progress = 100;
          file.uploadSuccess = true;
          this.fieldMappingService.uploaded.next(true);
          this.successEvent.emit(true);
        } else {
          file.progress = 100;
          file.uploadSuccess = false;
        }
        break;
      case HttpEventType.UploadProgress:
        file.progress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        setTimeout(() => {
          file.progress = 100;
        }, 1500);
    }
  }
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  close() {
    this.bsModalRef.hide();
  }

}
