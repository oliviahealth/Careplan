import React from "react";
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

    const SignInSchema = z.object({
        email: z.string().email().min(1, 'Email is required'),
        password: z.string().min(1, 'Password is required'),
    })
    type SignInFormData = z.infer<typeof SignInSchema>

<<<<<<< HEAD
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({ resolver: zodResolver(SignInSchema) });
=======
<<<<<<< HEAD
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({ resolver: zodResolver(SignInSchema) });
=======
<<<<<<< HEAD
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({ resolver: zodResolver(SignInSchema) });
=======
    let { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({ resolver: zodResolver(SignInSchema) });
>>>>>>> main
>>>>>>> main
>>>>>>> main

    const { mutate } = useMutation(async (data: SignInFormData) => {
        interface SignInResponse extends User {
            access_token: string
        }

        const user: SignInResponse = ((await axios.post(`http://127.0.0.1:5000/api/signin`, { ...data }))).data
        UserSchema.parse(user)

        console.log(user)
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
            alert(`error: ${error}`)
        }
    })

    return (
        <div className="flex justify-center h-full mt-[10vh]">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="flex flex-col w-3/4 md:w-1/3 h-fit justify-between [&>*]:my-3">
                <div className="flex self-center font-medium text-3xl">Welcome Back!</div>
                <div>
                    <p className="font-medium text-sm mb-1 ml-1">Email Address</p>
                    <input {...register("email")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="text" />
                    {errors.email && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                </div>

                <div>
                <p className="font-medium text-sm mb-1 ml-1">Password</p>
                    <input {...register("password")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="password" />
                    {errors.password && <span className="label-text-alt text-red-500">{errors.password.message}</span>}
                </div>

                <button className="button-filled rounded-full py-3 w-full">
                    Sign in
                </button>

                <div className="flex self-center">
                    <p className="text-sm">Don't have an account? <span className="button-colored font-medium p-0"><Link to={'/sign-up'}>Create one now.</Link></span></p>
                </div>
            </form>
        </div>
    )
}

export default SignUp;