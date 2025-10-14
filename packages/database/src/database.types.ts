export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      offer_technologies: {
        Row: {
          offer_id: number;
          skill_level: Database["public"]["Enums"]["skill_level_enum"];
          technology_id: number;
        };
        Insert: {
          offer_id: number;
          skill_level: Database["public"]["Enums"]["skill_level_enum"];
          technology_id: number;
        };
        Update: {
          offer_id?: number;
          skill_level?: Database["public"]["Enums"]["skill_level_enum"];
          technology_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "offer_technologies_offer_id_fkey";
            columns: ["offer_id"];
            isOneToOne: false;
            referencedRelation: "offers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offer_technologies_technology_id_fkey";
            columns: ["technology_id"];
            isOneToOne: false;
            referencedRelation: "technologies";
            referencedColumns: ["id"];
          },
        ];
      };
      offers: {
        Row: {
          application_url: string | null;
          city: string | null;
          company_logo_thumb_url: string | null;
          company_name: string | null;
          employment_type:
            | Database["public"]["Enums"]["employment_type_enum"]
            | null;
          experience_level:
            | Database["public"]["Enums"]["experience_level_enum"]
            | null;
          expired_at: string | null;
          id: number;
          languages: Json | null;
          last_published_at: string | null;
          offer_url: string;
          published_at: string | null;
          salary_currency: string | null;
          salary_from: number | null;
          salary_period:
            | Database["public"]["Enums"]["salary_period_enum"]
            | null;
          salary_to: number | null;
          scraping_run_id: number | null;
          slug: string | null;
          street: string | null;
          title: string;
          working_time: Database["public"]["Enums"]["working_time_enum"] | null;
          workplace_type:
            | Database["public"]["Enums"]["workplace_type_enum"]
            | null;
        };
        Insert: {
          application_url?: string | null;
          city?: string | null;
          company_logo_thumb_url?: string | null;
          company_name?: string | null;
          employment_type?:
            | Database["public"]["Enums"]["employment_type_enum"]
            | null;
          experience_level?:
            | Database["public"]["Enums"]["experience_level_enum"]
            | null;
          expired_at?: string | null;
          id?: number;
          languages?: Json | null;
          last_published_at?: string | null;
          offer_url: string;
          published_at?: string | null;
          salary_currency?: string | null;
          salary_from?: number | null;
          salary_period?:
            | Database["public"]["Enums"]["salary_period_enum"]
            | null;
          salary_to?: number | null;
          scraping_run_id?: number | null;
          slug?: string | null;
          street?: string | null;
          title: string;
          working_time?:
            | Database["public"]["Enums"]["working_time_enum"]
            | null;
          workplace_type?:
            | Database["public"]["Enums"]["workplace_type_enum"]
            | null;
        };
        Update: {
          application_url?: string | null;
          city?: string | null;
          company_logo_thumb_url?: string | null;
          company_name?: string | null;
          employment_type?:
            | Database["public"]["Enums"]["employment_type_enum"]
            | null;
          experience_level?:
            | Database["public"]["Enums"]["experience_level_enum"]
            | null;
          expired_at?: string | null;
          id?: number;
          languages?: Json | null;
          last_published_at?: string | null;
          offer_url?: string;
          published_at?: string | null;
          salary_currency?: string | null;
          salary_from?: number | null;
          salary_period?:
            | Database["public"]["Enums"]["salary_period_enum"]
            | null;
          salary_to?: number | null;
          scraping_run_id?: number | null;
          slug?: string | null;
          street?: string | null;
          title?: string;
          working_time?:
            | Database["public"]["Enums"]["working_time_enum"]
            | null;
          workplace_type?:
            | Database["public"]["Enums"]["workplace_type_enum"]
            | null;
        };
        Relationships: [
          {
            foreignKeyName: "offers_scraping_run_id_fkey";
            columns: ["scraping_run_id"];
            isOneToOne: false;
            referencedRelation: "scraping_runs";
            referencedColumns: ["id"];
          },
        ];
      };
      scraping_runs: {
        Row: {
          error_message: string | null;
          finished_at: string | null;
          id: number;
          offers_found_count: number | null;
          started_at: string;
          status: Database["public"]["Enums"]["run_status_enum"];
        };
        Insert: {
          error_message?: string | null;
          finished_at?: string | null;
          id?: number;
          offers_found_count?: number | null;
          started_at?: string;
          status?: Database["public"]["Enums"]["run_status_enum"];
        };
        Update: {
          error_message?: string | null;
          finished_at?: string | null;
          id?: number;
          offers_found_count?: number | null;
          started_at?: string;
          status?: Database["public"]["Enums"]["run_status_enum"];
        };
        Relationships: [];
      };
      technologies: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_or_create_technology: {
        Args: { tech_name: string };
        Returns: number;
      };
    };
    Enums: {
      employment_type_enum: "permanent" | "b2b" | "mandate_contract";
      experience_level_enum: "junior" | "mid" | "senior";
      run_status_enum: "running" | "completed" | "failed";
      salary_period_enum: "day" | "month" | "hour" | "year";
      skill_level_enum: "required" | "nice_to_have";
      working_time_enum: "full_time" | "part_time" | "b2b" | "freelance";
      workplace_type_enum: "remote" | "hybrid" | "office";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      employment_type_enum: ["permanent", "b2b", "mandate_contract"],
      experience_level_enum: ["junior", "mid", "senior"],
      run_status_enum: ["running", "completed", "failed"],
      salary_period_enum: ["day", "month", "hour", "year"],
      skill_level_enum: ["required", "nice_to_have"],
      working_time_enum: ["full_time", "part_time", "b2b", "freelance"],
      workplace_type_enum: ["remote", "hybrid", "office"],
    },
  },
} as const;
