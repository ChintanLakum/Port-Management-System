import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../stores/authentication";
import Message from "../../components/Message";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {

    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/user/signin/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log({data})
        dispatch(
          setLogin({
            isAdmin: data.isAdmin, 
            isSystemAdmin: data.isSystemAdmin,
            token: data.token,
            userProfilePhoto: data.userProfilePhoto,
            portId: data.portId,
            userId:data.userId
          })
        );
        localStorage.setItem("authToken", data.token);
        console.log("Login successful:",data.message);
        toast.success(data.message)
        setEmail("")
        setPassword("")
        // setError(null);
        // setMessage("Redirecting to Home page")
        setTimeout(() => navigate("/"), 2000);
      } else {
        const {message} = await response.json();
        console.error("Login failed:", message);
        toast.error(message)
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("A network error occurred. Please try again.");
       toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-cyan-700 mb-6">
          Log In
        </h1>
        {(message || error) && <Message message={message} error={error} />}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Link
              to={"/"}
              className="text-sm font-medium text-cyan-600 hover:text-cyan-500"
            >
              Forgot your password?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors disabled:bg-cyan-400"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
