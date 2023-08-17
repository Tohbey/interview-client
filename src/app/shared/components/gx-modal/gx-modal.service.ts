import {GxModalComponent} from "./gx-modal.component";
import {Injectable} from "@angular/core";
import {DEFAULT_GX_MODAL_CONFIG, GxModalOptions} from "./gx-modal-options";


@Injectable({
  providedIn: 'root'
})
export class GxModalService {
  private modals: any[] = [];

  add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(id: string) {
    // remove modal from array of active modals
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string, modalOptions?: GxModalOptions) {
    const modal:GxModalComponent = this.modals.find(x => x.id === id);
    if(modalOptions) {
      modal.modalConfig = Object.assign({}, DEFAULT_GX_MODAL_CONFIG, modalOptions);
    }
    modal.open();
  }

  close(id: string) {
    const modal = this.modals.find(x => x.id === id);
    if(modal)
      modal.close();
  }
}
