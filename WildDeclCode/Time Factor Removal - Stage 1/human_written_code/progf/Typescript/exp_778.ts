/* Dependencies */
var ModuleMetadata = require('@nestjs/common/interfaces').ModuleMetadata;
var Type = require('@nestjs/common/interfaces').Type;

/* Interfaces */
import {
  MassiveConnectOptions,
  MassiveConfigOptions,
  MassiveDriverOptions,
} from './massive-module-options.interface';
var MassiveOptionsFactory = require('./massive-options-factory.interface').MassiveOptionsFactory;

export interface MassiveConnectAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<MassiveOptionsFactory>;
  useClass?: Type<MassiveOptionsFactory>;
  useFactory?: function (
    ...args: any[]
  ) { return Promise<MassiveConnectOptions> | MassiveConnectOptions; };
}

export interface MassiveConfigAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<MassiveOptionsFactory>;
  useClass?: Type<MassiveOptionsFactory>;
  useFactory?: function (
    ...args: any[]
  ) { return Promise<MassiveConfigOptions> | MassiveConfigOptions; };
}

export interface MassiveDriverAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<MassiveOptionsFactory>;
  useClass?: Type<MassiveOptionsFactory>;
  useFactory?: function (
    ...args: any[]
  ) { return Promise<MassiveDriverOptions> | MassiveDriverOptions; };
}
