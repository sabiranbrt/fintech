// api/types.ts
import { endPoints } from '@/jsonDemo/services.json';

export type EndpointName = keyof typeof endPoints;

export type EndpointCfg<K extends EndpointName = EndpointName> =
    (typeof endPoints)[K];
