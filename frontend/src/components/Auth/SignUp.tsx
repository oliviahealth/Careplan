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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const SignUpSchema = z
    .object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email().min(1, 'Email is required'),
      password: z.string().min(1, 'Password is required'),
      confirmPassword: z.string().min(1, 'Confirm password is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords must match',
    });
  type SignupFormData = z.infer<typeof SignUpSchema>;

  const {
    register,
    handleSubmit: handleSignup,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(SignUpSchema) });

  const { mutate: signupUser, isLoading } = useMutation(
    async (data: SignupFormData) => {
      interface SignupResponse extends IUser {
        access_token: string;
      }

      const user: SignupResponse = (
        await axios.post(`${import.meta.env.VITE_API_URL}/signup`, { ...data, email: data.email.toLowerCase() })
      ).data;
      UserSchema.parse(user);

      return user;
    },
    {
      onSuccess: (response) => {
        if (!response) return;

        setAccessToken(response.access_token);
        setUser(response);

        return navigate('/');
      },
      onError: () => {
        setError("Something went wrong! Please try again later");
      },
    }
  );

  return (
    <div>
      <div>
        <p className="font-semibold text-2xl">Get Started</p>
        <p className="text-sm">Create your account now</p>
      </div>

      <form
        onSubmit={handleSignup((data) => signupUser(data))}
        className="form-control w-full py-4"
      >
        <div className="my-1">
          <label className="label">
            <span className="label-text text-black font-medium">Name</span>
          </label>
          <div className="flex w-full items-center border border-gray-200 rounded-xl p-1">
            <input
              {...register('name')}
              type="text"
              className="input flex-1 border-0 focus:border-transparent focus:ring-0 focus:outline-none"
              placeholder="Your name"
            />
          </div>
          {errors.name && (
            <span className="label-text-alt text-red-500">
              {errors.name.message}
            </span>
          )}
        </div>

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
        <div className="my-1">
          <label className="label">
            <span className="label-text text-black font-medium">Confirm Password</span>
          </label>
          <div className="flex w-full items-center gap-2 border border-gray-200 rounded-xl p-1">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              className="input flex-1 border-0 focus:border-transparent focus:ring-0 focus:outline-none"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="text-gray-500 text-sm px-2"
              aria-label="Toggle password visibility"
            >
              {showConfirmPassword ? <RiEyeFill /> : <RiEyeOffFill />}
            </button>
          </div>

          {errors.confirmPassword && (
            <span className="label-text-alt text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button className="btn button-filled w-full mt-6" disabled={isLoading}>
          {isLoading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          Sign Up
        </button>
      </form>

      <p className="text-sm mt-8">
        Have an account?{' '}
        <span className="button-colored p-0">
          <Link to={'/sign-in'}>Sign In</Link>
        </span>
      </p>
    </div>
  );
};

export default SignUp;
