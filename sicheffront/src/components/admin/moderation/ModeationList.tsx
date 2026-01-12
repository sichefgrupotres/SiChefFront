import ModerationCard from "./ModetaionCards";


export default function ModerationList({ tab }: any) {
  return (
    <section className="space-y-4 max-w-3xl">
      <ModerationCard
        title="Tacos al Pastor Premium"
        author="Marta Gómez"
        time="Hace 2 horas"
        comment="La receta es excelente, pero falta sal."
        status="PENDING"
      />

      {tab === "reported" && (
        <ModerationCard
          title="Pizza Napolitana Tradicional"
          author="Carlos Ruiz"
          time="Hace 5 horas"
          comment="¡Visiten mi canal de YouTube!"
          status="SPAM"
        />
      )}
    </section>
  );
}
