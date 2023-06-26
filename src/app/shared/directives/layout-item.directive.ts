import { Directive , Input, OnChanges, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';


const components = {

};

@Directive({
  selector: '[appLayoutItem]'
})
export class LayoutItemDirective implements OnChanges {

  @Input() componentRef: string;

  component: ComponentRef<any>;

  constructor(
    private container: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnChanges(): void {

   const component = components[this.componentRef];

   if (component) {
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
   }

  }

}
