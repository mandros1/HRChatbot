import { OnInit, ElementRef, Renderer2, Directive, HostListener, OnChanges } from '@angular/core';

@Directive({
  selector: '[appChatColor]'
})
export class ChatColorDirective implements OnInit, OnChanges {

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
  // this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue');
  }

  ngOnChanges() {
    this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue');
  }

}
