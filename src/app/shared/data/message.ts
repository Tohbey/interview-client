/**
 * Created by OLUWASEUN on 7/19/2017.
 */
export interface Message {

  summary: string;

  detail?: string;

  severity: string;

}

export interface FieldMessage extends Message {

  fieldName: string;
}

/*
export enum Severity {
  SUCCESS,
  INFO,
  WARNING,
  ERROR,
  FATAL,
  DANGER
}
*/

export const Severity = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  DANGER: 'danger'
};
