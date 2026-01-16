import { TutorialFormValues } from "@/validators/TutorialSchema";
export interface CreateTutorialResult {
  ok: boolean;
  status: number;
  data?: any;
  message?: string;
}

export const createTutorial = async (
  data: TutorialFormValues,
  token: string
): Promise<CreateTutorialResult> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("recipeId", data.recipeId);
  formData.append("video", data.video!);
  formData.append("ingredients", JSON.stringify(data.ingredients));
  formData.append("steps", JSON.stringify(data.steps));

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutorial`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {}

  return {
    ok: res.ok,
    status: res.status,
    data: body,
    message: body?.message,
  };
};
