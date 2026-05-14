import type { User } from "@supabase/supabase-js";
import {
  LISTING_PHOTO_BUCKET,
  MAX_LISTING_PHOTO_BYTES,
  MAX_LISTING_PHOTOS,
  type ListingPhotoReference,
} from "./photoUpload";
import type { createClient } from "../supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

const ALLOWED_CONDITIONS = ["new", "like_new", "good", "fair", "poor"] as const;

type ListingCondition = (typeof ALLOWED_CONDITIONS)[number];

type ListingDraftAiOutput = {
  title: string;
  description: string;
  category: string;
  condition: ListingCondition;
  credit_price: number;
  ai_confidence: number;
  ai_suggested_price: number | null;
};

export type ListingDraft = ListingDraftAiOutput & {
  photos: ListingPhotoReference[];
};

export type ListingDraftPhotoInput = Pick<
  ListingPhotoReference,
  "bucket" | "path" | "contentType" | "size"
>;

export type ListingDraftResult =
  | {
      ok: true;
      draft: ListingDraft;
    }
  | {
      ok: false;
      message: string;
      status: 400 | 401 | 502;
    };

export type ListingDraftAiPhoto = ListingPhotoReference & {
  dataUrl: string;
};

export type ListingDraftAiClient = (
  photos: ListingDraftAiPhoto[],
) => Promise<unknown>;

type OpenAiResponse = {
  output_text?: unknown;
  output?: Array<{
    content?: Array<{
      text?: unknown;
    }>;
  }>;
};

const LISTING_DRAFT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "description",
    "category",
    "condition",
    "credit_price",
    "ai_confidence",
    "ai_suggested_price",
  ],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    category: { type: "string" },
    condition: { type: "string", enum: ALLOWED_CONDITIONS },
    credit_price: { type: "integer" },
    ai_confidence: { type: "number" },
    ai_suggested_price: { type: ["integer", "null"] },
  },
};

export async function generateListingDraftFromPhotos(
  supabase: SupabaseClient,
  photos: unknown,
  aiClient: ListingDraftAiClient = generateOpenAiListingDraft,
): Promise<ListingDraftResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "Sign in to generate a listing draft.",
      status: 401,
    };
  }

  const validation = validateListingDraftPhotoReferences(user, photos);

  if (!validation.ok) {
    return validation;
  }

  const downloadedPhotos = await downloadListingDraftPhotos(
    supabase,
    validation.photos,
  );

  if (!downloadedPhotos.ok) {
    return downloadedPhotos;
  }

  let aiOutput: unknown;
  try {
    aiOutput = await aiClient(downloadedPhotos.photos);
  } catch {
    return {
      ok: false,
      message: "Could not generate a listing draft right now.",
      status: 502,
    };
  }

  const draftOutput = validateListingDraftAiOutput(aiOutput);

  if (!draftOutput) {
    return {
      ok: false,
      message: "The listing draft response was invalid.",
      status: 502,
    };
  }

  return {
    ok: true,
    draft: {
      ...draftOutput,
      photos: validation.photos,
    },
  };
}

function validateListingDraftPhotoReferences(
  user: User,
  photos: unknown,
):
  | { ok: true; photos: ListingPhotoReference[] }
  | { ok: false; message: string; status: 400 } {
  if (!Array.isArray(photos) || photos.length === 0) {
    return {
      ok: false,
      message: "Add at least one listing photo before generating a draft.",
      status: 400,
    };
  }

  if (photos.length > MAX_LISTING_PHOTOS) {
    return {
      ok: false,
      message: `Generate a draft from up to ${MAX_LISTING_PHOTOS} listing photos.`,
      status: 400,
    };
  }

  const validPhotos: ListingPhotoReference[] = [];

  for (const photo of photos) {
    if (!isListingDraftPhotoInput(photo)) {
      return invalidPhotoReference();
    }

    if (
      photo.bucket !== LISTING_PHOTO_BUCKET ||
      !photo.path.startsWith(`${user.id}/listing-photos/`)
    ) {
      return invalidPhotoReference();
    }

    if (!isAllowedPhotoContentType(photo.contentType)) {
      return invalidPhotoReference();
    }

    if (
      !Number.isInteger(photo.size) ||
      photo.size <= 0 ||
      photo.size > MAX_LISTING_PHOTO_BYTES
    ) {
      return invalidPhotoReference();
    }

    validPhotos.push({
      bucket: LISTING_PHOTO_BUCKET,
      path: photo.path,
      contentType: photo.contentType,
      size: photo.size,
    });
  }

  return { ok: true, photos: validPhotos };
}

function isListingDraftPhotoInput(
  photo: unknown,
): photo is ListingDraftPhotoInput {
  if (!photo || typeof photo !== "object") {
    return false;
  }

  const candidate = photo as Record<string, unknown>;

  return (
    typeof candidate.bucket === "string" &&
    typeof candidate.path === "string" &&
    typeof candidate.contentType === "string" &&
    typeof candidate.size === "number"
  );
}

function invalidPhotoReference() {
  return {
    ok: false,
    message: "Use valid uploaded listing photo references.",
    status: 400,
  } as const;
}

function isAllowedPhotoContentType(contentType: string) {
  return (
    contentType === "image/jpeg" ||
    contentType === "image/png" ||
    contentType === "image/webp"
  );
}

async function downloadListingDraftPhotos(
  supabase: SupabaseClient,
  photos: ListingPhotoReference[],
): Promise<
  | { ok: true; photos: ListingDraftAiPhoto[] }
  | { ok: false; message: string; status: 400 }
> {
  const downloadedPhotos: ListingDraftAiPhoto[] = [];

  for (const photo of photos) {
    const { data, error } = await supabase.storage
      .from(LISTING_PHOTO_BUCKET)
      .download(photo.path);

    if (error || !data) {
      return {
        ok: false,
        message: "Could not read one of the uploaded listing photos.",
        status: 400,
      };
    }

    downloadedPhotos.push({
      ...photo,
      dataUrl: await blobToDataUrl(data, photo.contentType),
    });
  }

  return { ok: true, photos: downloadedPhotos };
}

async function blobToDataUrl(blob: Blob, contentType: string) {
  const buffer = Buffer.from(await blob.arrayBuffer());

  return `data:${contentType};base64,${buffer.toString("base64")}`;
}

export function validateListingDraftAiOutput(
  output: unknown,
): ListingDraftAiOutput | null {
  if (!output || typeof output !== "object") {
    return null;
  }

  const candidate = output as Record<string, unknown>;
  const title = sanitizeText(candidate.title, 80);
  const description = sanitizeText(candidate.description, 1000);
  const category = sanitizeText(candidate.category, 40);
  const condition = candidate.condition;
  const creditPrice = candidate.credit_price;
  const aiConfidence = candidate.ai_confidence;
  const aiSuggestedPrice = candidate.ai_suggested_price;

  if (
    !title ||
    title.length < 3 ||
    !description ||
    description.length < 10 ||
    !category ||
    category.length < 2 ||
    !isListingCondition(condition) ||
    !isValidCreditPrice(creditPrice) ||
    !isValidConfidence(aiConfidence) ||
    !isValidSuggestedPrice(aiSuggestedPrice)
  ) {
    return null;
  }

  return {
    title,
    description,
    category,
    condition,
    credit_price: creditPrice,
    ai_confidence: aiConfidence,
    ai_suggested_price: aiSuggestedPrice,
  };
}

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().replace(/\s+/g, " ");

  if (trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
}

function isListingCondition(value: unknown): value is ListingCondition {
  return (
    typeof value === "string" &&
    ALLOWED_CONDITIONS.includes(value as ListingCondition)
  );
}

function isValidCreditPrice(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 10000
  );
}

function isValidConfidence(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 1;
}

function isValidSuggestedPrice(value: unknown): value is number | null {
  return value === null || isValidCreditPrice(value);
}

async function generateOpenAiListingDraft(
  photos: ListingDraftAiPhoto[],
): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OpenAI API key.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_LISTING_DRAFT_MODEL ?? "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "Generate JSON for a marketplace listing draft from the user photos. Use conservative category, condition, confidence, and credit price estimates.",
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Draft a concise marketplace listing. Return only the structured JSON fields requested.",
            },
            ...photos.map((photo) => ({
              type: "input_image",
              image_url: photo.dataUrl,
            })),
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "listing_draft",
          strict: true,
          schema: LISTING_DRAFT_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error("OpenAI draft request failed.");
  }

  const data = (await response.json()) as OpenAiResponse;
  const outputText = extractOpenAiOutputText(data);

  if (!outputText) {
    throw new Error("OpenAI draft response was empty.");
  }

  return JSON.parse(outputText);
}

function extractOpenAiOutputText(response: OpenAiResponse) {
  if (typeof response.output_text === "string") {
    return response.output_text;
  }

  for (const output of response.output ?? []) {
    for (const content of output.content ?? []) {
      if (typeof content.text === "string") {
        return content.text;
      }
    }
  }

  return null;
}
