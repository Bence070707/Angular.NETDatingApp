import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const generateCacheKey = (url: string, params: HttpParams): string =>{
    const paramString = params.keys().map(key => `${key}=${params.get(key)}`).join('&');
    return paramString ? `${url}?${paramString}` : url;
  }

  const cacheKey = generateCacheKey(req.url, req.params);

  if(req.method === 'GET'){
    const cachedResponse = cache.get(cacheKey);
    if(cachedResponse){
      return of(cachedResponse);
    }
  }

  loadingService.busy();

  return next(req).pipe(
    delay(500),
    tap(response => {
      cache.set(cacheKey, response)
    }),
    finalize(()=>{
      loadingService.idle();
    })
  );
};
