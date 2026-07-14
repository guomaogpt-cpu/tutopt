import { readFile, stat } from "fs/promises";
import { NextResponse } from "next/server";
import {
  getImageContentType,
  getUploadRootDir,
  resolveSafeUploadPath,
} from "@/features/listings/lib/upload-paths";

type RouteParams = {
  params: Promise<{ path: string[] }>;
};

function notFoundResponse(details: {
  uploadDir: string;
  requestedPath: string;
  filePath: string | null;
}) {
  console.warn("[uploads] not found", details);
  return new NextResponse("Not found", { status: 404 });
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { path: pathParts } = await params;
  const uploadDir = getUploadRootDir();
  const requestedPath = pathParts?.join("/") ?? "";

  if (!pathParts || pathParts.length === 0) {
    return notFoundResponse({
      uploadDir,
      requestedPath,
      filePath: null,
    });
  }

  const absolutePath = resolveSafeUploadPath(pathParts);
  if (!absolutePath) {
    return notFoundResponse({
      uploadDir,
      requestedPath,
      filePath: null,
    });
  }

  const contentType = getImageContentType(absolutePath);
  if (!contentType) {
    return notFoundResponse({
      uploadDir,
      requestedPath,
      filePath: absolutePath,
    });
  }

  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) {
      return notFoundResponse({
        uploadDir,
        requestedPath,
        filePath: absolutePath,
      });
    }

    const buffer = await readFile(absolutePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return notFoundResponse({
      uploadDir,
      requestedPath,
      filePath: absolutePath,
    });
  }
}
