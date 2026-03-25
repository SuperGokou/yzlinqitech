import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZES: Record<string, number> = {
  "order-attachments": 10 * 1024 * 1024,
  "message-attachments": 10 * 1024 * 1024,
  "portfolio-images": 5 * 1024 * 1024,
  "blog-images": 5 * 1024 * 1024,
  avatars: 2 * 1024 * 1024,
};

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const bucket = formData.get("bucket") as string | null;

  if (!file || !bucket) {
    return NextResponse.json(
      { success: false, message: "File and bucket are required" },
      { status: 400 }
    );
  }

  const maxSize = MAX_FILE_SIZES[bucket];
  if (!maxSize) {
    return NextResponse.json(
      { success: false, message: "Invalid bucket" },
      { status: 400 }
    );
  }

  if (file.size > maxSize) {
    return NextResponse.json(
      {
        success: false,
        message: `File too large. Max: ${maxSize / 1024 / 1024}MB`,
      },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { success: false, message: "File type not allowed" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop();
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return NextResponse.json({
    success: true,
    data: {
      name: file.name,
      url: urlData.publicUrl,
      size: file.size,
      type: file.type,
    },
  });
}
