// import { notFound } from "next/navigation"
// import CloseModalButton from "@/components/CloseModalButton"
// import { IModalTutorial } from "@/interfaces/ITutorial"

// async function fetchTutorialByRecipe(recipeId: string) {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tutorials/by-recipe/${recipeId}`,
//     { cache: "no-store" }
//   )

//   if (res.status === 404) {
//     return null
//   }

//   if (!res.ok) {
//     throw new Error("Error cargando tutorial")
//   }

//   return res.json()
// }
// export default async function TutorialByRecipePage({
//   params,
// }: {
//   params: { recipeId: string }
// }) {
//   const { recipeId } = params
//   const tutorial = await fetchTutorialByRecipe(recipeId)

//   return (
//     <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
//       <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden">
//         <CloseModalButton />

//         <div className="aspect-video">
//           <video
//             src={tutorial.videoUrl}
//             controls
//             preload="metadata"
//             className="w-full h-full"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

import Link from "next/link"

async function fetchTutorialByRecipe(recipeId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tutorials/by-recipe/${recipeId}`,
    { cache: "no-store" }
  )

  if (!res.ok) return null
  return res.json()
}

export default async function TutorialModal({
  params,
}: {
  params: { recipeId: string }
}) {
  const tutorial = await fetchTutorialByRecipe(params.recipeId)

  if (!tutorial) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden">
        <Link
          href="/creator"
          className="absolute top-4 right-4 z-50 text-white text-xl"
        >
          ✕
        </Link>

        <div className="aspect-video">
          <video
            src={tutorial.videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}