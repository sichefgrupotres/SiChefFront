
import CloseModalButton from "@/components/CloseModalButton"
import { notFound } from "next/navigation"

async function fetchTutorialByRecipe(recipeId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tutorials/by-recipe/${recipeId}`,
    { cache: "no-store" }
  )

  if (!res.ok) return null
  return res.json()
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ recipeId: string }>
}) {
  const { recipeId } = await params

  const tutorial = await fetchTutorialByRecipe(recipeId)

  if (!tutorial) notFound()

return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden">
        <CloseModalButton />

        <div className="aspect-video">
          <video
            src={tutorial.videoUrl}
            controls
            preload="metadata"
            className="w-full h-full"
            
          />
        </div>
      </div>
    </div>
  );
}