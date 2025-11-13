import { nanoid } from "nanoid";
import { createServerClient } from "@/lib/supabase";

export type DocumentRequest = {
  id: string;
  email: string;
  document: string;
  company: string;
  message?: string;
  status: "pending" | "responded";
  createdAt: string;
};

type NewRequestPayload = {
  email: string;
  document: string;
  company: string;
  message?: string;
};

const TABLE_NAME = "document_requests";

export async function listRequests(): Promise<DocumentRequest[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch requests from Supabase:", error);
    throw new Error("Unable to load document requests");
  }

  return (
    data?.map((item) => ({
      id: item.id,
      email: item.email,
      document: item.document,
      company: item.company,
      message: item.message ?? undefined,
      status: item.status ?? "pending",
      createdAt: item.created_at,
    })) ?? []
  );
}

export async function addRequest(
  payload: NewRequestPayload
): Promise<DocumentRequest> {
  const supabase = createServerClient();
  const newRequest: DocumentRequest = {
    id: nanoid(10),
    email: payload.email,
    document: payload.document,
    company: payload.company,
    message: payload.message,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([
      {
        id: newRequest.id,
        email: newRequest.email,
        document: newRequest.document,
        company: newRequest.company,
        message: newRequest.message ?? null,
        status: newRequest.status,
        created_at: newRequest.createdAt,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    console.error("Failed to persist request in Supabase:", error);
    throw new Error("Unable to register the document request");
  }

  return {
    id: data.id,
    email: data.email,
    document: data.document,
    company: data.company,
    message: data.message ?? undefined,
    status: data.status ?? "pending",
    createdAt: data.created_at,
  };
}

