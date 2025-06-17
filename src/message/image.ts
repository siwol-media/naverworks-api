export interface ImageMessage {
  type: "image";
  previewImageUrl?: string;
  originalContentUrl?: string;
  fileId?: string;
}