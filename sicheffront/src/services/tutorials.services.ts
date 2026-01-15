import { TutorialFormValues } from "@/validators/TutorialSchema";

export const createTutorial = async (
  data: TutorialFormValues,
  token: string
): Promise<boolean> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("recipeId", data.recipeId);
  formData.append("video", data.video!);

  formData.append("ingredients", JSON.stringify(data.ingredients));
  formData.append("steps", JSON.stringify(data.steps));

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutorials`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return res.ok;
};
