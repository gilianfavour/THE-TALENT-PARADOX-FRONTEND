import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;

/** Extracts plain text from an uploaded CV (PDF, Word .docx or .txt) so the candidate can check it before applying. */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "Choose a CV file to upload." }, { status: 422 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: "That file is over 5 MB. Try a smaller PDF or Word file." }, { status: 422 });
  }

  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let text = "";
    if (name.endsWith(".pdf") || file.type === "application/pdf") {
      const { extractText, getDocumentProxy } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const result = await extractText(pdf, { mergePages: true });
      text = Array.isArray(result.text) ? result.text.join("\n") : result.text;
    } else if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (name.endsWith(".txt") || file.type.startsWith("text/")) {
      text = buffer.toString("utf8");
    } else {
      return NextResponse.json({ message: "Upload a PDF, Word (.docx) or text file." }, { status: 422 });
    }

    text = text.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    if (text.length < 30) {
      return NextResponse.json(
        { message: "We could not read text from that file (it may be a scanned image). Please paste or describe your experience instead." },
        { status: 422 }
      );
    }
    return NextResponse.json({ text: text.slice(0, 20000), chars: text.length, file: file.name });
  } catch {
    return NextResponse.json({ message: "We could not read that file. Try another format or paste your CV." }, { status: 422 });
  }
}
