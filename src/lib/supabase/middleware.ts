import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    userRole = profile?.role ?? null;
  }

  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    if (!user || userRole !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("returnUrl", path);
      return NextResponse.redirect(url);
    }
  }

  if (path.startsWith("/dashboard")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("returnUrl", path);
      return NextResponse.redirect(url);
    }
  }

  if (path.startsWith("/login") || path.startsWith("/register")) {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = userRole === "admin" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (
    path.startsWith("/api/orders") ||
    path.startsWith("/api/quotes") ||
    path.startsWith("/api/upload")
  ) {
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return supabaseResponse;
}
