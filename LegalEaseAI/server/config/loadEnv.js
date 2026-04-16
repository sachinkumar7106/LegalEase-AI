import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const serverDir = path.resolve(currentDir, "..");
const appRootDir = path.resolve(serverDir, "..");

dotenv.config({ path: path.join(appRootDir, ".env") });
dotenv.config({ path: path.join(serverDir, ".env"), override: true });
