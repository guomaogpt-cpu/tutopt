import { readFile, stat } from "fs/promises";
import { NextResponse } from "next/server";
import {
  getImageContentType,
  resolveSafeUploadPath,
} from "@/features/listings/lib/upload-paths";

type RouteParams = {
  params: Promise<{ path: string[] }>;
};

function notFoundResponse(requestedPath: string) {
  console.warn("[uploads] not found", { requestedPath });
  return new NextResponse("Not found", { status: 404 });
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { path: pathParts } = await params;
  const requestedPath = pathParts?.join("/") ?? "";

  if (!pathParts || pathParts.length === 0) {
    return notFoundResponse(requestedPath);
  }

  const absolutePath = resolveSafeUploadPath(pathParts);
  if (!absolutePath) {
    return notFoundResponse(requestedPath);
  }

  const contentType = getImageContentType(absolutePath);
  if (!contentType) {
    return notFoundResponse(requestedPath);
  }

  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) {
      return notFoundResponse(requestedPath);
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
    return notFoundResponse(requestedPath);
  }
}
