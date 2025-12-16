import RecipeCard from "@/components/CardRepice";
import { RecipeInterface } from "@/interfaces/IRepice";

const recipes: RecipeInterface[] = [
  {
    id: "1",
    title: "Lasaña clásica",
    image: "/lasagna.jpg",
    difficulty: "medio",
    isPremium: true,
  },
  {
    id: "2",
    title: "Pizza napolitana",
    image: "/pizza.jpg",
    difficulty: "facil",
    isPremium: true,
  },
  {
    id: "3",
    title: "Ravioli",
    image: "/ravioli.jpg",
    difficulty: "facil",
    isPremium: true,
  },
];

export default function RecipesList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-[#3D2B1F] min-h-screen">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
