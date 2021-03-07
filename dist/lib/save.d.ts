/// <reference types="node" />
import type { GridPaint as gp } from '../index';
declare function save(this: gp, file?: string, scale?: number): Promise<null | Blob | Buffer> | undefined;
export { save };
