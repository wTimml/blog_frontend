"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import apiService from "../services/apiServices";
import { handleLogin } from "../lib/actions";
import IsLoading from "../components/isLoading";

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    
    const response = await apiService.postWithoutToken('/api/auth/login/', JSON.stringify(formData));

    if (response.access) {
      handleLogin(response.user.pk, response.access, response.refresh);

      router.push('/');
    } else {
      setErrors(response.non_field_errors);
      setIsLoading(false);
    }

  };

  if (isLoading) {
    return (
        <IsLoading/>
    );
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-pink-600">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
            <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-pink-600">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-green-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-pink-600">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-green-500 hover:text-green-400">
                      {/* TODO  */}
                      Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-green-600 sm:text-sm"
                />
              </div>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-100 text-red-700 p-3 rounded">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center mt-4 bg-white text-gray-800 font-bold rounded border-2 border-green-500 hover:border-green-600 hover:bg-green-500 hover:text-white shadow-md py-2 px-6"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            <a href="/register" className="font-semibold text-green-500 hover:text-green-400">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  )
  }