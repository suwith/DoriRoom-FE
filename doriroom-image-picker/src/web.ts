import { WebPlugin } from '@capacitor/core';
import type { DoriroomImagePickerPlugin } from './definitions';

export class DoriroomImagePickerWeb extends WebPlugin implements DoriroomImagePickerPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }

  async pickImages(_: { limit: number }): Promise<{ paths: string[] }> {
    console.warn('pickImages is not supported on web.');
    return { paths: [] };
  }
}
