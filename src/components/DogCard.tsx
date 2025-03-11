import { Heart } from "lucide-react";
import type { Dog } from "../types";
import { cn, formatBreed } from "../lib/utils";

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: string) => void;
}

export function DogCard({ dog, isFavorite, onToggleFavorite }: DogCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48">
        <img
          src={dog.img}
          alt={dog.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => onToggleFavorite(dog.id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{dog.name}</h3>

        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Breed:</span> {formatBreed(dog.breed)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Age:</span> {dog.age}{" "}
            {dog.age === 1 ? "year" : "years"}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Zip Code:</span> {dog.zip_code}
          </p>
        </div>
      </div>
    </div>
  );
}
