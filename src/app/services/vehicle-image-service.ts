import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VehicleImageService {
uploadImages(
    vehicle: string,
    userId: string,
    phase: string,
    images: string[]
  ): Promise<any> {

    if (images.length < 4 || images.some(img => !img)) {
      return Promise.reject('Please capture all 4 images before uploading.');
    }

    const formData = new FormData();
    formData.append('vehicle', vehicle);
    formData.append('userId', userId);
    formData.append('phase', phase);

    formData.append('front', this.dataURLtoFile(images[0], 'front.png'));
    formData.append('back', this.dataURLtoFile(images[1], 'back.png'));
    formData.append('left', this.dataURLtoFile(images[2], 'left.png'));
    formData.append('right', this.dataURLtoFile(images[3], 'right.png'));

    return fetch('http://localhost:8080/api/images/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }).then(async response => {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload failed: ${text}`);
      }
      return response.json();
    });
  }

  private dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
