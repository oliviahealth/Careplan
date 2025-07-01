import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import useAppStore from '../../store/useAppStore';
import { IUser, UserSchema } from '../../utils/interfaces';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const setUser = useAppStore((state) => state.setUser);
  const setAccessToken = useAppStore((state) => state.setAccessToken);

  const setError = useAppStore(state => state.setError);

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
          <input
            {...register('name')}
            type="text"
            className="input w-full border-gray-200 focus:border-[#5D1B2A] focus:outline-none"
          />
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
          <input
            {...register('email')}
            type="email"
            className="input w-full border-gray-200 focus:border-[#5D1B2A] focus:outline-none"
          />
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
          <input
            {...register('password')}
            type="password"
            className="input w-full border-gray-200 focus:border-[#5D1B2A] focus:outline-none"
          />
          {errors.password && (
            <span className="label-text-alt text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="my-1">
          <label className="label">
            <span className="label-text text-black font-medium">
              Confirm Password
            </span>
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            className="input w-full border-gray-200 focus:border-[#5D1B2A] focus:outline-none"
          />
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
