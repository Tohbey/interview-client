export interface GxModalOptions {
  bodyClass?: string;
  height?: string;
  width?: string;
  padding?: string;
  modalClass?: string;
  backdropClass?: string;
  closeOnOutSideClick?: boolean;
}

export const DEFAULT_GX_MODAL_CONFIG: GxModalOptions = {
  closeOnOutSideClick: true,
  width: '50vw',
  height: '50vh',
  modalClass: "",
  bodyClass: "",
  backdropClass: ""
}
