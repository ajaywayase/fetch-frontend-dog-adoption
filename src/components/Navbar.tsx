import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, LogOut, User, Menu, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { logout } from "../lib/api";
import { cn } from "../lib/utils";

interface NavbarProps {
  favoritesCount: number;
  onMatch: () => void;
}

export function Navbar({ favoritesCount, onMatch }: NavbarProps) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch user name from localStorage that was saved during login
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

  // Handles user logout
  async function handleLogout() {
    try {
      await logout();
      localStorage.removeItem("userName");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
      console.log("Failed to logout", error);
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-600">Fetch Dogs</h1>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={onMatch}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Heart className="w-5 h-5" />
              Get Matched
            </button>

            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5" />
              <span>{userName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className={cn("lg:hidden", isMenuOpen ? "block" : "hidden")}>
          <div className="pt-4 pb-3 space-y-3">
            <button
              onClick={() => {
                onMatch();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Heart className="w-5 h-5" />
              Match ({favoritesCount})
            </button>

            <div className="flex items-center gap-2 px-4 py-2 text-gray-700 border-t border-gray-100">
              <User className="w-5 h-5" />
              <span>{userName}</span>
            </div>

            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:text-gray-900 border-t border-gray-100"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
