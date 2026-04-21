import { NextRequest, NextResponse } from "next/server";
import { getAutoSuggestions, detectCategory } from "@/lib/smart-search";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const suggestions = getAutoSuggestions(q);
  const detectedCategory = detectCategory(q);

  return NextResponse.json({
    suggestions,
    detectedCategory,
  });
}
