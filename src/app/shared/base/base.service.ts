
import {share} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Subject, Observable, Subscription, ReplaySubject} from 'rxjs';
import {DataResponse, IDataResponse} from '../data/data-response';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {RequestMethod} from "./request-method.enum";
import {UtilService} from "./util.service";

const isFunction = (obj) => {
  return typeof obj === "function";
}


@Injectable()
export abstract class BaseService<M, ID> {
  protected service$: ServiceArgs = {baseUrl: '/'};

  constructor(private http$: HttpClient) {
    this.onInit();
  }

  private onInit() {
    const service$ = this[ServiceVarName];
    if (service$ instanceof Object) {
      const baseUrl = service$.baseUrl;
      service$.baseUrl = baseUrl ? (baseUrl.endsWith('/') ? baseUrl : baseUrl + '/') : '/';
      this.service$ = service$;
    }
  }


  find(id: ID, pathUrl?: string): Observable<DataResponse<M>> {
    return this.sendGET<M>(
      this.toRequestUrl(pathUrl || `find/${id}`));
  }

  save(m: M, pathUrl?: string): Observable<DataResponse<M>> {
    return this.sendPOST(this.toRequestUrl(pathUrl || 'save'),
      {
        body: m
      });
  }

  create(m: M, pathUrl?: string): Observable<DataResponse<M>> {
    return this.sendPOST<M>(this.toRequestUrl(pathUrl || 'create'), {
      body: m
    });
  }

  update(m: M, pathUrl?: string): Observable<DataResponse<M>> {
    return this.sendREQUEST({url: this.toRequestUrl(pathUrl || 'update'), method: RequestMethod.Put, body: m});
  }

  delete(id: ID, pathUrl?: string): Observable<DataResponse<M>> {
    return this.sendREQUEST({
      url: this.toRequestUrl(pathUrl || `delete/${id}`),
      method: RequestMethod.Delete,
      params: this.httpParams({modelId: id})
    });
  }

  bulkDelete(ids: any, pathUrl?: string): Observable<DataResponse<M>> {
    return this.sendREQUEST({
      url: this.toRequestUrl(pathUrl || `bulk-delete`),
      method: RequestMethod.Delete,
      body: ids
    });
  }


  /*
   * Generic http methods
   * */
  public sendGET<T>(url: string, options?: HttpRequestOptions, appendPathPrefix: boolean = true): Observable<DataResponse<T>> {
    options = options || {};
    options.headers = this.httpHeaders(options.headers);
    const callback = this.recallback<DataResponse<T>, DataResponse<T>>(
      this.http$.get<DataResponse<T>>(appendPathPrefix ? this.appendServiceIp(url) : url, options || {}));
    return callback;
  }

  public sendPOST<T>(url: string, options?: HttpRequestOptions): Observable<DataResponse<T>> {
    options = options || {};
    options.headers = this.httpHeaders(options.headers);
    const callback = this.recallback<DataResponse<T>, DataResponse<T>>(
      this.http$.post<DataResponse<T>>(this.appendServiceIp(url), options ? options.body : {}, options || {}));
    return callback;
  }

  public sendPATCH<T>(url: string, options?: HttpRequestOptions): Observable<DataResponse<T>> {
    options = options || {};
    options.headers = this.httpHeaders(options.headers);
    const callback = this.recallback<DataResponse<T>, DataResponse<T>>(
      this.http$.patch<DataResponse<T>>(this.appendServiceIp(url), options ? options.body : {}, options || {}));
    return callback;
  }

  public sendREQUEST<T>(options: HttpRequestArgs): Observable<DataResponse<T>> {
    options.headers = this.httpHeaders(options.headers);
    const callback = this.recallback<DataResponse<T>, DataResponse<T>>(
      this.http$.request<DataResponse<T>>(this.httpMethod(options.method), this.appendServiceIp(options.url), options || {}));
    return callback;
  }

  public toRequestUrl(pathUrl: string): string {
    pathUrl = pathUrl || '';
    pathUrl = pathUrl.startsWith('/') ? pathUrl.substr(1) : pathUrl;
    console.log(this.service$.baseUrl + pathUrl);
    return this.service$.baseUrl + pathUrl;
  }


  protected httpHeaders(headers?: HttpHeaders | {}): HttpHeaders {
    let httpHeaders: HttpHeaders;
    if (headers instanceof HttpHeaders) {
      httpHeaders = headers;
    } else {
      httpHeaders = new HttpHeaders();
      if (headers) {
        Object.keys(headers).forEach((key) => {
          httpHeaders = httpHeaders.append(key, headers[key]);
        });
      }
    }
    if (!httpHeaders.get('Content-Type')) {
      httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    }
    return httpHeaders;
  }

  protected httpParams(params: {}): HttpParams {
    let httParams: HttpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      httParams = httParams.append(key, params[key]);
    });
    return httParams;
  }

  protected httpMethod(method: string | RequestMethod): string {
    if (typeof method !== 'string') {
      method = Object.keys(RequestMethod).find(value => RequestMethod[value] === method);
    }
    return <string>method;
  }

  protected appendServiceIp(url){
    return UtilService.appendServiceIp(url);
  }


  private toDataResponse(value: any): any | IDataResponse<any> {
    if (value && value.hasOwnProperty('responseCode') && value.hasOwnProperty('responseData')) {
      value = Object.assign(new IDataResponse(), value);
    }
    return value;
  }

  public recallback<M, T>(subscribable: Observable<M>, success?: (value: M) => T): Observable<T> {
    const callback: Subject<T> = new ReplaySubject(1);
    if (subscribable) {
      const subscription: Subscription = subscribable.subscribe((value: M) => {
          // conversion for generic error
          value = this.toDataResponse(value);
          if (!success || !isFunction(success)) {
            success = (v) => <any>v;
          }
          const t: T = success.call(this, value);
          callback.next(t);
        },
        (error: any) => {
          if (error && error.error) {
            error.error = this.toDataResponse(error.error);
          }
          callback.error(error);
        }, () => {
          callback.complete();
          callback.unsubscribe();
          setTimeout(() => {
            subscription.unsubscribe();
          }, 10);
        });
    } else {
      setTimeout(() => {
        callback.complete();
        callback.unsubscribe();
      }, 100);
    }
    return callback.pipe(share());
  }

  public callback<F>(subscribable: Observable<F>, successFn?: (value: F) => void, errorFn?: (error: any) => void, completeFn?: () => void) {
    if (subscribable) {
      const subscription: Subscription = subscribable.subscribe((value: F) => {
          if (!successFn || !isFunction(successFn)) {
            successFn = (v) => <any>v;
          }
          successFn.call(this, value);
        },
        (error: any) => {
          if (errorFn && isFunction(errorFn)) {
            errorFn.call(this, error);
          }
        }, () => {
          if (completeFn && isFunction(completeFn)) {
            completeFn.call(this);
          }
          setTimeout(() => {
            subscription.unsubscribe();
          }, 10);
        });
    }
  }


}

export const ServiceVarName = '$Service$';

export function Service(args: string | ServiceArgs): Function {
  return (constructor: Function) => {
    args = args ? (typeof args === 'string' ? {baseUrl: args} : args) : {baseUrl: ''};
    // args = args ? (typeof args === 'string' ? {baseUrl: environment.humanManagerApiIp + (args.startsWith('/') ? args.substr(1) : args)} : args) : {baseUrl: ''};
    constructor.prototype[ServiceVarName] = args;
  };
}

export interface ServiceArgs {
  baseUrl: string
}

/*export interface HttpRequestArgs {
 headers: { [name: string]: any };
 }*/

export interface AuthArgs {
  headers: { [name: string]: any };
}

export interface HttpRequestOptions {
  body?: any;
  headers?: HttpHeaders;
  reportProgress?: boolean;
  observe?: any;
  params?: HttpParams;
  responseType?: any;
  withCredentials?: boolean;
}

export interface HttpRequestArgs extends HttpRequestOptions {
  url: string;
  method: string | RequestMethod;
}


