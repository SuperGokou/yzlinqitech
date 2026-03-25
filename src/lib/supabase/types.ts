export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "admin" | "client";
          name: string;
          company: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Omit<Database["public"]["Tables"]["profiles"]["Row"], "id" | "role">>;
      };
      services: {
        Row: {
          id: string;
          title_zh: string;
          title_en: string;
          slug: string;
          description_zh: string | null;
          description_en: string | null;
          icon: string | null;
          tags: string[];
          features_zh: string[];
          features_en: string[];
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["services"]["Row"], "id" | "created_at" | "updated_at" | "is_active" | "sort_order"> & {
          id?: string;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          client_id: string | null;
          service_id: string | null;
          title: string;
          description: string;
          budget_range: string | null;
          attachments: Array<{ name: string; url: string; size: number; type: string }>;
          status: "pending" | "quoted" | "confirmed" | "in_progress" | "delivered" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at" | "status" | "attachments"> & {
          id?: string;
          status?: Database["public"]["Tables"]["orders"]["Row"]["status"];
          attachments?: Database["public"]["Tables"]["orders"]["Row"]["attachments"];
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      quotes: {
        Row: {
          id: string;
          order_id: string;
          created_by: string | null;
          amount: number;
          currency: string;
          breakdown: Record<string, unknown> | null;
          valid_until: string | null;
          status: "draft" | "sent" | "accepted" | "rejected";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["quotes"]["Row"], "id" | "created_at" | "updated_at" | "currency" | "status"> & {
          id?: string;
          currency?: string;
          status?: Database["public"]["Tables"]["quotes"]["Row"]["status"];
        };
        Update: Partial<Database["public"]["Tables"]["quotes"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          order_id: string;
          sender_id: string | null;
          content: string;
          attachments: Array<{ name: string; url: string; size: number; type: string }>;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at" | "attachments" | "read_at"> & {
          id?: string;
          attachments?: Database["public"]["Tables"]["messages"]["Row"]["attachments"];
          read_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      portfolio_items: {
        Row: {
          id: string;
          title_zh: string;
          title_en: string;
          slug: string;
          description_zh: string | null;
          description_en: string | null;
          images: string[];
          category: string;
          tech_stack: string[];
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["portfolio_items"]["Row"], "id" | "created_at" | "updated_at" | "is_featured" | "sort_order"> & {
          id?: string;
          is_featured?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["portfolio_items"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title_zh: string;
          title_en: string;
          excerpt_zh: string | null;
          excerpt_en: string | null;
          content_zh: string;
          content_en: string;
          tags: string[];
          tag_color: string | null;
          read_time: number;
          author_id: string | null;
          published_at: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["blog_posts"]["Row"], "id" | "created_at" | "updated_at" | "is_published" | "read_time"> & {
          id?: string;
          is_published?: boolean;
          read_time?: number;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };
      site_content: {
        Row: {
          id: string;
          section: string;
          key: string;
          value_zh: string | null;
          value_en: string | null;
          type: "text" | "number" | "image" | "url";
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["site_content"]["Row"], "id" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_content"]["Insert"]>;
      };
    };
  };
}
