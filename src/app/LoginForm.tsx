"use client";
import React, { useState } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

type LoginFormProps = object;

const LoginForm: React.FC<LoginFormProps> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Removed unused state: focused and setFocused


  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const router = useRouter();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your login logic here
    console.log("Username:", username);
    console.log("Password:", password);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 items-center mt-8">
      {/* Username Field */}
      <div className="w-full">
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            {/* Google Material Icon: person */}
            <span className="material-icons text-blue-600 text-[20px] align-middle">person</span>
          </span>
          <input
            type="text"
            id="username"
            required
            value={username}
            onChange={handleUsernameChange}
            placeholder="Username"
            className="w-full pl-10 pr-10 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600 transition-colors group-hover:border-blue-400 group-focus-within:border-blue-400 text-base text-gray-800 font-normal"
          />
        </div>
      </div>
      {/* Password Field */}
      <div className="w-full">
        <div className="relative group mt-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            {/* Google Material Icon: vpn_key */}
            <span className="material-icons text-blue-600 text-[20px] align-middle">vpn_key</span>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            required
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-700 transition-colors group-hover:border-blue-400 group-focus-within:border-blue-400 text-base text-gray-800 font-normal"
          />
          {/* Eye Icon Toggle */}
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            <span className="material-icons text-gray-500 text-[22px] align-middle select-none">
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </button>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-row w-full gap-3 mt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded py-2 transition-colors"
        >
        Login
        </button>
        <button
          type="button"
          className="flex items-center justify-center border border-gray-300 bg-white text-gray-700 rounded transition shadow hover:shadow-md"
          style={{ width: 44, height: 40, padding: 0 }}
          aria-label="Login dengan Google"
          onClick={async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined"
          ? `${window.location.origin}/dashboard`
          : undefined,
      },
    });
  }}
        >
          <Image src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" width={22} height={22} style={{ display: 'block' }} />
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
