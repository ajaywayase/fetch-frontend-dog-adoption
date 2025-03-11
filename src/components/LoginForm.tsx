import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dog, PawPrint } from "lucide-react";
import { toast } from "react-hot-toast";
import { login } from "../lib/api";
import { cn } from "../lib/utils";

export function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // Form state to store user input
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  // Handles login form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      // Save user name to localStorage
      localStorage.setItem("userName", formData.name);
      navigate("/search");
    } catch (error) {
      toast.error("Failed to login. Please try again.");
      console.log("Failed to login. Please try again.", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <Dog className="w-12 h-12 text-purple-600" />
            <PawPrint className="w-8 h-8 text-pink-500 -ml-2" />
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Welcome to Fetch
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Find your perfect furry companion
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",
                isLoading && "opacity-75 cursor-not-allowed"
              )}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
