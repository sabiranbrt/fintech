// api/utils.ts
import { endPoints } from '@/jsonDemo/services.json';
import { EndpointName, EndpointCfg } from './types';

/** Returns the endpoint config object for a given key  */
export const getEndpoint = <K extends EndpointName>(key: K): EndpointCfg<K> =>
    endPoints[key];
