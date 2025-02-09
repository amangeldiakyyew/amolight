import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

export type FileUploaderConfig = {
  saveDir?: string;
  createDateFolder?: boolean;
};

export type FileUploadResponse = { path: string; name: string };

export default class FileUploader {
  private static defaultSaveDir = path.join(process.cwd(), "public/uploads");
  private static config: FileUploaderConfig = {
    saveDir: this.defaultSaveDir,
    createDateFolder: false,
  };

  static init(config: FileUploaderConfig) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  static async upload(
    file: File,
    config: FileUploaderConfig & {
      name?: string | null;
    } = FileUploader.config,
  ): Promise<FileUploadResponse> {
    config = {
      ...this.config,
      ...config,
    };

    if (!file || !(file instanceof File)) {
      throw new Error("No file uploaded");
    }

    try {
      const dir = this.getDir(config);
      const name = config.name ? config.name : this.generateSafeFileName(file);
      const finalPath = path.join(dir, name);
      const result = await this.saveFile(file, finalPath);
      return {
        path: result,
        name: file.name,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private static async saveFile(file: File, saveDir: string): Promise<string> {
    try {
      const dirname = path.dirname(saveDir);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }
      fs.writeFileSync(saveDir, Buffer.from(await file.arrayBuffer()));
      return saveDir;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private static generateSafeFileName(file: File): string {
    const fileNameWithoutExt = path.basename(
      file.name,
      path.extname(file.name),
    );
    const fileExt = path.extname(file.name).toLowerCase().slice(1);
    return slugify(`${fileNameWithoutExt.slice(0, 20)}-${uuidv4()}.${fileExt}`);
  }

  private static getDir(
    config: FileUploaderConfig = FileUploader.config,
  ): string {
    const dateFolder =
      config.createDateFolder && new Date().toISOString().split("T")[0];
    return path.join(config.saveDir || this.defaultSaveDir, dateFolder || "");
  }
}
