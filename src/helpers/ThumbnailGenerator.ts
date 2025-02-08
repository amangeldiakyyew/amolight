import fs from "fs";
import path from "path";
import sharp from "sharp";

export type Thumbnail = {
  w: number;
  h: number;
  s: string;
};

class ThumbnailGeneratorError extends Error {
  static debug = false;

  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ThumbnailGeneratorError";
    this.code = code || "THUMBNAIL_GENERATION_ERROR";
  }
}

export default class ThumbnailGenerator {
  // Utility function to check if the file exists
  private static checkFileExists(filePath: string): boolean {
    const exists = fs.existsSync(filePath);
    if (exists) {
      return true;
    }
    ThumbnailGeneratorError.debug && console.error(filePath, "File not found");
    throw new ThumbnailGeneratorError("File not found", "FILE_NOT_FOUND");
  }

  // Generate thumbnails based on the given widths
  public static async generateThumbnails(config: {
    widths: number[];
    sourcePath: string;
    destinationDir?: string;
    withoutEnlargement?: boolean;
    newExtension?: "png" | "webp" | "jpg" | "gif";
    removeOriginal?: boolean;
  }): Promise<Thumbnail[]> {
    this.checkFileExists(config.sourcePath);

    let {
      widths,
      sourcePath,
      destinationDir,
      withoutEnlargement,
      newExtension = config.newExtension ? config.newExtension : "jpg",
      removeOriginal = config.removeOriginal ? config.removeOriginal : true,
    } = config;

    if (!destinationDir) {
      destinationDir = path.dirname(sourcePath);
    }
    const fileNameWithoutExt = path.basename(
      sourcePath,
      path.extname(sourcePath),
    );
    const fileExt = path.extname(sourcePath).toLowerCase().slice(1);

    const generatedThumbnails: Thumbnail[] = [];

    // Process each width
    for (const width of widths) {
      try {
        const outputFilePath = path.join(
          destinationDir,
          `${fileNameWithoutExt}-${width}.${newExtension || fileExt}`,
        );
        const sharpInstance = sharp(sourcePath);
        const image = await sharpInstance
          .resize(width, null, { withoutEnlargement })
          .toFile(outputFilePath);

        generatedThumbnails.push({
          w: image.width,
          h: image.height,
          s: outputFilePath.replaceAll("\\", "/").replace("/", ""),
        });
        sharpInstance.destroy();
      } catch (error: any) {
        ThumbnailGeneratorError.debug && console.error(error);
        throw new ThumbnailGeneratorError(error.message, error.code);
      }
    }

    if (removeOriginal) {
      fs.unlink(sourcePath, (error) => {
        if (error) {
          ThumbnailGeneratorError.debug && console.error(error);
        }
      });
    }

    return generatedThumbnails;
  }
}
