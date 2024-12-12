import './RecipeCard.css';
interface Recipe {
    tags?: string[];
    title: string;
    owner?: string;
    email?: string;
    ingredients: string;
    directions: string;
    _id?: string;
}
interface RecipeCardProps {
    recipe: Recipe;
    onDelete: (id: string) => void;
}
declare function RecipeCard({ recipe, onDelete }: RecipeCardProps): import("react/jsx-runtime").JSX.Element;
export default RecipeCard;
