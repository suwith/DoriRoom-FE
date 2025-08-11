import { registerPlugin } from '@capacitor/core';

import type { DoriroomImagePickerPlugin } from './definitions';

const DoriroomImagePicker = registerPlugin<DoriroomImagePickerPlugin>('DoriroomImagePicker', {
  web: () => import('./web').then((m) => new m.DoriroomImagePickerWeb()),
});

export * from './definitions';
export { DoriroomImagePicker };
