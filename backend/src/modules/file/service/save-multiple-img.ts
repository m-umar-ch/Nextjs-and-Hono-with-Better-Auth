import { saveSingleImage } from "./save-single-img";

// export interface SaveMultipleImageResult {
//   data: {
//     file: FileTableType;
//     sortOrder?: number;
//   } | null;
//   error: Error | null;
//   success: boolean;
//   sortOrder?: number; // Preserved from input for easy access in both success and error cases
// }

/**
 * Saves multiple image files to disk and creates database records.
 * Each image can have an optional custom slug and sort order.
 *
 * @param images - Array of image inputs with optional custom slug and sort order
 * @returns Array of results, each containing the file record, sort order (if provided), and error status
 *
 * @example
 * ```ts
 * const results = await saveMultipleImages([
 *   { img: file1, customImgSlug: "custom-name", sortOrder: 1 },
 *   { img: file2, sortOrder: 2 },
 *   { img: file3 }
 * ]);
 * results.forEach(result => {
 *   if (result.success) {
 *     console.log("File saved:", result.data?.file.slug, "Sort order:", result.data?.sortOrder);
 *   } else {
 *     console.error("Error:", result.error);
 *   }
 * });
 * ```
 */
export async function saveMultipleImages(
  images: {
    img: File;
    customImgSlug?: string;
    sortOrder?: number;
  }[]
) {
  // Process all images in parallel
  const results = await Promise.all(
    images.map(async (input) => {
      const { img, customImgSlug, sortOrder } = input;

      // Save the single image
      const result = await saveSingleImage(img, customImgSlug);

      // If successful, include the sortOrder in the response
      if (result.success && result.data) {
        return {
          data: {
            file: result.data,
            sortOrder: sortOrder,
          },
          error: null,
          success: true,
          sortOrder: sortOrder,
        } as const;
      }

      // If failed, return error with sortOrder preserved
      return {
        data: null,
        error: result.error,
        success: false,
        sortOrder: sortOrder,
      } as const;
    })
  );

  return results;
}
