import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("=== Upload API Called ===");

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Validasi ukuran (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 50MB" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";
    let meta: Record<string, any> = {};

    /* ======================
       PDF
    ====================== */
    if (file.type === "application/pdf") {
      const { extractText } = await import("unpdf");

      const result = await extractText(new Uint8Array(buffer), {
        mergePages: true,
      });

      text = result.text;
      meta.pages = result.totalPages;
    } else if (

    /* ======================
       DOC / DOCX
    ====================== */
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const mammoth = await import("mammoth");

      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (

    /* ======================
       PPT / PPTX
    ====================== */
      file.type === "application/vnd.ms-powerpoint" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      const pptxParser = (await import("pptx-parser")).default;
      const slides = await pptxParser.parse(buffer);

      text = slides
        .map((slide: any, index: number) => {
          const content = slide.text?.join(" ") || "";
          return `Slide ${index + 1}: ${content}`;
        })
        .join("\n");

      meta.slides = slides.length;
    } else if (file.type === "text/plain") {

    /* ======================
       TXT
    ====================== */
      text = buffer.toString("utf-8");
    } else {

    /* ======================
       UNSUPPORTED
    ====================== */
      return NextResponse.json(
        { error: `Format file tidak didukung: ${file.type}` },
        { status: 400 },
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Tidak ada teks yang bisa diekstrak" },
        { status: 400 },
      );
    }

    console.log("Text extracted successfully:", {
      length: text.length,
      meta,
    });

    // 👉 NEXT STEP:
    // chunking → embedding → supabase → quiz generation

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType: file.type,
      textLength: text.length,
      meta,
      text,
    });
  } catch (error: any) {
    console.error("=== Upload Error ===");
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal memproses file",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export const maxDuration = 30;
