import { NextFunction, Router, Response, RequestHandler } from 'express'
import { IncomingHttpHeaders } from 'http';
import { THeaderKey, TObjectId, TResponseType, TResult } from '../../shared/types';

export interface IControllerBase {
  path: string
  router: Router
}