import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/users/register", {
        name,
        email,
        password
      });

      toast.success("Account created successfully! Please log in.");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      const errorMsg = error.response?.data?.email || error.response?.data?.message || error.message || "Registration failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              TeamCollab
            </h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Get started</h2>
              <p className="text-gray-600">Create your account to get started</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                  Full name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Feature highlights */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Collaborate with your team</h3>
            <p className="text-indigo-100">
              Manage projects, assign tasks, and track progress all in one place.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span className="text-sm">Real-time project tracking</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span className="text-sm">Team collaboration tools</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span className="text-sm">Secure and reliable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;