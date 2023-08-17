import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {GxModalService} from "./gx-modal.service";
import {DEFAULT_GX_MODAL_CONFIG, GxModalOptions} from "./gx-modal-options";

@Component({
  selector: 'app-gx-modal',
  templateUrl: './gx-modal.component.html',
  styleUrls: ['./gx-modal.component.scss']
})
export class GxModalComponent implements OnInit {

  @Input() id!: string;

  private element: any;

  @Input() modalConfig?: GxModalOptions;

  constructor(private modalService: GxModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.initViewConfig();
    // close modal on background click

    document.body.appendChild(this.element);
    this.element.addEventListener('click', (el:any) => {
      if (el.target.className === 'gx-modal') {
        this.close();
      }
    });

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }

  initViewConfig() {
    this.modalConfig = Object.assign({}, DEFAULT_GX_MODAL_CONFIG, this.modalConfig);
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  // open modal
  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('gx-modal-open');
  }

  // close modal
  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('gx-modal-open');
  }
}
