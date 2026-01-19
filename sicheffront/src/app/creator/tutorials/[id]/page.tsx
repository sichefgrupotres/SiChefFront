import { notFound } from "next/navigation";
import { IModalTutorial } from "@/interfaces/ITutorial";
import CloseModalButton from "@/components/CloseModalButton";

async function fetchTutorial(id: string): Promise<IModalTutorial> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tutorials/${id}`,
    { cache: "no-store" },
  );

  if (!res.ok) notFound();
  return res.json();
}

export default async function TutorialPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const tutorial = await fetchTutorial(id);

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
