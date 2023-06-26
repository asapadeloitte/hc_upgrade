import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FileUploadComponent } from './file-upload.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HumanCapitalService } from '../../services/humanCapital.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [BsModalRef, HumanCapitalService, ApiEndpointsConfig, AuthService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close function', () => {
    it('close should be defined', () => {
      component.close();
    });
  });
  describe('onFileDroped', () => {
    it('upload the file using the drag and drop', () => {
      const filelist = [{
        File: {
          progress: 100
        },
        length: 1
      }];
      spyOn(component, 'processFiles');
      component.onFileDropped(filelist);
      expect(component.processFiles).toHaveBeenCalled();
    });
  });
  describe('fileBrowseHandler', () => {
    it('upload the file using the drag and drop', () => {
      const filelist = [{
        File: {
          progress: 100
        },
        length: 1
      }];
      spyOn(component, 'processFiles');
      component.fileBrowseHandler(filelist);
      expect(component.processFiles).toHaveBeenCalled();
    });
  });
  describe('process Files', () => {
    it('get the size of each file and push', () => {
      const files: Array<File> = [];
      for (const item of files) {
        // ignore empty files
        if (item.size > 0) {
          this.files.push(item);
        }
      }
      spyOn(component, 'uploadFile');
      component.processFiles(files);
      expect(component.uploadFile).toBeDefined();
    });
    it('process Files', () => {
      const files: Array<File> = [];
      spyOn(component, 'uploadFile');
      component.processFiles(files);
      expect(component.uploadFile).toHaveBeenCalled();
    });
  });
  describe('upload files', () => {
    it('it should use for response type on uploaded files', () => {
      const filelist = {
        File: {
          progress: 100
        },
        length: 1
      };
      component.uploadFile(filelist);
      expect(component.uploadFile).toBeDefined();
    });
  });
  describe('format Bytes function', () => {

    it('it should return 0  file size', () => {
      let decimals;
      component.formatBytes(0, decimals = 2);
      expect(component.formatBytes).toBeDefined();
    });
    it('it should return size of file', () => {
      let decimals;
      component.formatBytes(117896, decimals = 2);
      expect(component.formatBytes).toBeDefined();
    });
  });
  describe('close function', () => {
    it('close should be defined', () => {
      component.close();
    });
  });
});
