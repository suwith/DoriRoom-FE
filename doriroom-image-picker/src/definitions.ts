export interface DoriroomImagePickerPlugin {
  pickImages(options: { limit: number }): Promise<{ paths: string[] }>;
}
