"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiService from "../services/apiServices";
import { handleLogin } from "../lib/actions";
import IsLoading from "../components/isLoading";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password1: "", password2: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    
    const response = await apiService.postWithoutToken('/api/auth/register/', JSON.stringify(formData));

    if (response.access) {
      handleLogin(response.user.pk, response.access, response.refresh);

      router.push('/');
      // setIsLoading(false);
    } else {
      const tmpErrors: string[] = Object.values(response).map((error: any) => {
        return error;
      })

      setErrors(tmpErrors);
      setIsLoading(false);
    }

  };

  if (isLoading) {
    return (
        <IsLoading/>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-pink-600">
          Registration
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
                <label htmlFor="password1" className="block text-sm font-medium text-gray-900 dark:text-pink-600">
                Password
                </label>
                <div className="mt-2">
                <input
                    id="password1"
                    name="password1"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={formData.password1}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-green-600 sm:text-sm"
                />
                </div>
            </div>

            <div>
                <label htmlFor="password2" className="block text-sm font-medium text-gray-900 dark:text-pink-600">
                Repeat Password
                </label>
                <div className="mt-2">
                <input
                    id="password2"
                    name="password2"
                    type="password"
                    required
                    autoComplete="current-password2"
                    value={formData.password2}
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
                Sign up
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
