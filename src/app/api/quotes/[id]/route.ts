import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateQuoteSchema = z.object({
  status: z.enum(["draft", "sent", "accepted", "rejected"]).optional(),
  amount: z.number().positive().optional(),
  notes: z.string().max(2000).optional(),
  valid_until: z.string().optional(),
  breakdown: z.record(z.string(), z.unknown()).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = updateQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      },
      { status: 400 }
    );
  }

  // Verify quote exists
  const { data: existing, error: fetchError } = await supabase
    .from("quotes")
    .select("id, order_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json(
      { success: false, message: "Quote not found" },
      { status: 404 }
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("quotes")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { success: false, message: updateError.message },
      { status: 500 }
    );
  }

  // If quote is accepted, update the order status to confirmed
  if (parsed.data.status === "accepted" && existing.order_id) {
    await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", existing.order_id);
  }

  return NextResponse.json({ success: true, data: updated });
}
