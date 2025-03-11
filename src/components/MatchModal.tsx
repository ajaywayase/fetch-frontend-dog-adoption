import { Dog } from "lucide-react";
import type { Dog as DogType } from "../types";
import { formatBreed } from "../lib/utils";

interface MatchModalProps {
  dog: DogType;
  onClose: () => void;
}

export function MatchModal({ dog, onClose }: MatchModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-scale-up">
        <div className="relative h-64">
          <img
            src={dog.img}
            alt={dog.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-3xl font-bold">{dog.name}</h2>
            <p className="text-lg opacity-90">{formatBreed(dog.breed)}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Dog className="w-8 h-8 text-purple-600" />
            <h3 className="text-2xl font-bold text-gray-900">It's a Match!</h3>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg text-gray-900 mb-2">
                Meet {dog.name}, your perfect companion!
              </p>
              <p className="text-gray-600">
                A wonderful {formatBreed(dog.breed)} who is {dog.age}{" "}
                {dog.age === 1 ? "year" : "years"} old and can't wait to meet
                you!
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Dog Details</h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>
                  <span className="font-medium">Breed:</span>{" "}
                  {formatBreed(dog.breed)}
                </li>
                <li>
                  <span className="font-medium">Age:</span> {dog.age}{" "}
                  {dog.age === 1 ? "year" : "years"}
                </li>
                <li>
                  <span className="font-medium">ZIP Code:</span> {dog.zip_code}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
