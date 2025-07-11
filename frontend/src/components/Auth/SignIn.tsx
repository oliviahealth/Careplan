import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import useAppStore from '../../store/useAppStore';
import { IUser, UserSchema } from '../../utils/interfaces';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const setUser = useAppStore((state) => state.setUser);
  const setAccessToken = useAppStore((state) => state.setAccessToken);

  const setError = useAppStore(state => state.setError);

  const [showPassword, setShowPassword] = useState(false);

  const SignInSchema = z.object({
    email: z.string().email().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
  });
  type SignInFormData = z.infer<typeof SignInSchema>;

  const {
    register,
    handleSubmit: handleSignIn,
    formState: { errors },
  } = useForm<SignInFormData>({ resolver: zodResolver(SignInSchema) });

  const { mutate: signInUser, isLoading } = useMutation(
    async (data: SignInFormData) => {
      interface SignInResponse extends IUser {
        access_token: string;
      }

      const user: SignInResponse = (
        await axios.post(`${import.meta.env.VITE_API_URL}/signin`, { ...data, email: data.email.toLowerCase() })
      ).data;
      UserSchema.parse(user);

      return user;
    },
    {
      onSuccess: (response) => {
        if (response) {
          setAccessToken(response.access_token);
          setUser(response);

          return navigate('/dashboard');
        }
      },
      onError: () => {
        setError("Something went wrong! Please try again later");
      },
    }
  );

  return (
    <>
      <div>
        <p className="font-semibold text-2xl">Welcome Back!</p>
        <p className="text-sm">Sign in to your account</p>
      </div>

      <form
        onSubmit={handleSignIn((data) => signInUser(data))}
        className="form-control w-full"
      >
        <div className="my-1">
          <label className="label">
            <span className="label-text text-black font-medium">Email</span>
          </label>
          <div className="flex w-full items-center border border-gray-200 rounded-xl p-1">
            <input
              {...register('email')}
              type="email"
              className="input flex-1 border-0 focus:border-transparent focus:ring-0 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <span className="label-text-alt text-red-500">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="my-1">
          <label className="label">
            <span className="label-text text-black font-medium">Password</span>
          </label>
          <div className="flex w-full items-center gap-2 border border-gray-200 rounded-xl p-1">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="input flex-1 border-0 focus:border-transparent focus:ring-0 focus:outline-none"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-500 text-sm px-2"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
            </button>
          </div>

          {errors.password && (
            <span className="label-text-alt text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>

        <button className="btn button-filled w-full mt-6">
          {isLoading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          Sign In
        </button>
      </form>

      <p className="text-sm mt-8">
        Don't have an account?{' '}
        <span className="button-colored p-0">
          <Link to={'/sign-up'}>Create one now!</Link>
        </span>
      </p>
    </>
  );
};

export default SignUp;
