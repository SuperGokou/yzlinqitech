import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatusSchema } from "@/lib/validations/order";
import type { ApiResponse } from "@/lib/types";
import type { Database } from "@/lib/supabase/types";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderStatus = OrderRow["status"];

/**
 * Valid status transitions: each key maps to the statuses it can transition to.
 */
const VALID_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ["quoted", "cancelled"],
  quoted: ["confirmed", "cancelled"],
  confirmed: ["in_progress", "cancelled"],
  in_progress: ["delivered", "cancelled"],
  delivered: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export async function GET(
  _request: NextRequest,
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

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { success: false, message: "Order not found" },
      { status: 404 }
    );
  }

  const [quotesResult, messagesResult] = await Promise.all([
    supabase
      .from("quotes")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("messages")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
  ]);

  const response: ApiResponse<{
    order: OrderRow;
    quotes: Database["public"]["Tables"]["quotes"]["Row"][];
    messages: Database["public"]["Tables"]["messages"]["Row"][];
  }> = {
    success: true,
    data: {
      order,
      quotes: quotesResult.data ?? [],
      messages: messagesResult.data ?? [],
    },
  };

  return NextResponse.json(response);
}

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

  const parsed = updateOrderStatusSchema.safeParse(body);
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

  // Fetch current order to validate transition
  const { data: currentOrder, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", id)
    .single();

  if (fetchError || !currentOrder) {
    return NextResponse.json(
      { success: false, message: "Order not found" },
      { status: 404 }
    );
  }

  const currentStatus = currentOrder.status as OrderStatus;
  const newStatus = parsed.data.status;

  const validNext = VALID_TRANSITIONS[currentStatus];
  if (!validNext.includes(newStatus)) {
    return NextResponse.json(
      {
        success: false,
        message: `Cannot transition from "${currentStatus}" to "${newStatus}". Valid transitions: ${validNext.join(", ") || "none"}`,
      },
      { status: 400 }
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { success: false, message: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: updated });
}
