import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";

import useAppStore, { UserSchema, User } from "../../store/useAppStore";

const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const setUser = useAppStore((state) => state.setUser);
    const setAccessToken = useAppStore((state) => state.setAccessToken);
    const [errorDetected, setErrorDetected] = useState(false);

    const SignInSchema = z.object({
        email: z.string().email().min(1, 'Email is required'),
        password: z.string().min(1, 'Password is required'),
    })
    type SignInFormData = z.infer<typeof SignInSchema>

    const { register, handleSubmit: handleSignIn, formState: { errors } } = useForm<SignInFormData>({ resolver: zodResolver(SignInSchema) });

    const { mutate: signInUser, isLoading } = useMutation(async (data: SignInFormData) => {
        interface SignInResponse extends User {
            access_token: string
        }

        const user: SignInResponse = ((await axios.post(`http://127.0.0.1:5000/api/signin`, { ...data }))).data
        UserSchema.parse(user)

        return user
    }, {
        onSuccess: (response) => {
            if (response) {
                setAccessToken(response.access_token);

                sessionStorage.setItem('access_token', response.access_token);
                
                setUser(response);
                return navigate("/dashboard")
            }
        },
        onError: (error: AxiosError) => {
            setErrorDetected(true);

            console.error(error);
        }
    })

    return (
        <>
            <div>
                <p className="font-semibold text-2xl">Welcome Back!</p>
                <p className="text-sm">Sign in to your account</p>

                { errorDetected && (<p className="text-sm text-red-500">Something went wrong. Please try again</p>) }
            </div>

            <form onSubmit={handleSignIn((data) => signInUser(data))} className="form-control w-full">
                <div className="my-1">
                    <label className="label">
                        <span className="label-text text-black font-medium">Email</span>
                    </label>
                    <input {...register("email")} type="email" className="input w-full border-gray-200 focus:border-[#5D1B2A] focus:outline-none" />
                    {errors.email && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                </div>

                <div className="my-1">
                    <label className="label">
                        <span className="label-text text-black font-medium">Password</span>
                    </label>
                    <input {...register("password")} type="password" className="input w-full border-gray-200 focus:border-[#5D1B2A] focus:outline-none" />
                    {errors.password && <span className="label-text-alt text-red-500">{errors.password.message}</span>}
                </div>

                <button className="btn button-filled w-full mt-6">
                    {isLoading && (<span className="loading loading-spinner loading-sm"></span>)}
                    Sign In
                </button>
            </form>

            <p className="text-sm mt-8">Don't have an account? <span className="button-colored p-0"><Link to={'/sign-up'}>Create one now!</Link></span></p>
        </>
    )
}

export default SignUp;