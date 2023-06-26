import { Injectable } from '@angular/core';
// import { UUID } from 'angular2-uuid';

export interface IComponent {
  id: string;
  componentRef: string;
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  // public options: GridsterConfig = {
  //   compactType: 'compactUp&Left',
  //   resizable: {
  //     enabled: true,
  //   },
  //   floating: true,
  //   pushing: true,
  //   swapping: true,
  //   isMobile: true,
  //   mobileBreakPoint: 768,
  //   columns: this.getColumns(),
  //   dynamicColumns: true,
  //   minWidthToAddANewColumn: 255,
  //   rowHeight: 400,
  //   draggable: {
  //     enabled: true,
  //   }
  // };

  // public layout: GridsterItem[] = [];
  public components: IComponent[] = [];

  dropId: string;

  // getColumns() {
  //   const browserWidth = window.innerWidth;
  //   if (browserWidth < 1300) {
  //     return 3;
  //   } else if (browserWidth < 1500) {
  //     return 4;
  //   } else if (browserWidth < 1700) {
  //     return 5;
  //   }
  //   return 6;
  // }

  constructor() { }

  // deleteItem(id: string): void {
  //   const item = this.layout.find(d => d.id === id);
  //   this.layout.splice(this.layout.indexOf(item), 1);
  //   const comp = this.components.find(c => c.id === id);
  //   this.components.splice(this.components.indexOf(comp), 1);
  // }

  // setDropId(dropId: string): void {
  //   this.dropId = dropId;
  // }

  // dropItem(dragId: string): void {
  //   const { components } = this;
  //   const comp: IComponent = components.find(c => c.id === this.dropId);
  //   const updateIdx: number = comp ? components.indexOf(comp) : components.length;
  //   const componentItem: IComponent = {
  //     id: this.dropId,
  //     componentRef: dragId
  //   };
  //   this.components = Object.assign([], this.components, { [updateIdx]: componentItem });
  // }

  // getComponentRef(id: string): string {
  //   const comp = this.components.find(c => c.id === id);
  //   return comp ? comp.componentRef : null;
  // }

}
