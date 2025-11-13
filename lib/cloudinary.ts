import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

export interface UploadResult {
  url: string
  publicId: string
  width?: number
  height?: number
  format?: string
}

export async function uploadImage(
  file: Buffer | string,
  folder: string,
  options?: {
    publicId?: string
    resourceType?: 'image' | 'video'
  }
): Promise<UploadResult> {
  try {
    return new Promise((resolve, reject) => {
      let uploadOptions: any = {
        folder,
        resource_type: options?.resourceType || 'image',
        overwrite: true,
      }

      if (options?.publicId) {
        uploadOptions.public_id = options.publicId
      }

      const uploadCallback = (error: any, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error)
          reject(new Error('Failed to upload image to Cloudinary'))
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          })
        }
      }

      if (Buffer.isBuffer(file)) {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          uploadCallback
        ).end(file)
      } else {
        cloudinary.uploader.upload(
          file,
          uploadOptions,
          uploadCallback
        )
      }
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image from Cloudinary')
  }
}

export async function uploadMultipleImages(
  files: Array<{ buffer: Buffer; originalName: string }>,
  folder: string
) {
  const uploadPromises = files.map((file, index) =>
    uploadImage(file.buffer, folder, {
      publicId: `image_${Date.now()}_${index}`,
    })
  )

  try {
    const results = await Promise.all(uploadPromises)
    return results
  } catch (error) {
    console.error('Multiple images upload error:', error)
    throw new Error('Failed to upload one or more images')
  }
}