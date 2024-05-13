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

    const SignUpSchema = z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email().min(1, 'Email is required'),
        password: z.string().min(1, 'Password is required'),
        confirmPassword: z.string().min(1, 'Confirm password is required')
    }).refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords must match'
    });
    type SignupFormData = z.infer<typeof SignUpSchema>;

<<<<<<< HEAD
    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({ resolver: zodResolver(SignUpSchema) });
=======
    let { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({ resolver: zodResolver(SignUpSchema) });
>>>>>>> main

    const { mutate } = useMutation(async (data: SignupFormData) => {
        interface SignupResponse extends User {
            access_token: string
        }

        const user: SignupResponse = ((await axios.post(`http://127.0.0.1:5000/api/signup`, { ...data }))).data
        UserSchema.parse(user)

        console.log(user)
        return user
    }, {
        onSuccess: (response) => {
            if (response) {
                setAccessToken(response.access_token);
                sessionStorage.setItem('access_token', response.access_token);
                setUser(response);
                return navigate("/")
            }
        },
        onError: (error: AxiosError) => {
            alert(`error: ${error}`)
        }
    })

    return (
        <div className="flex justify-center h-full mt-[10vh]">
            <form onSubmit={handleSubmit((data) => mutate(data))} className="flex flex-col w-3/4 md:w-1/3 h-fit justify-between [&>*]:my-3">
                <div className="flex self-center font-medium text-3xl">Sign up</div>
                <div>
                    <p className="font-medium text-sm mb-1 ml-1">Name</p>
                    <input {...register("name")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="text" />
                    {errors.name && <span className="label-text-alt text-red-500">{errors.name.message}</span>}
                </div>

                <div>
                    <p className="font-medium text-sm mb-1 ml-1">Email</p>
                    <input {...register("email")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="text" />
                    {errors.email && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                </div>

                <div>
                    <p className="font-medium text-sm mb-1 ml-1">Password</p>
                    <input {...register("password")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="password" />
                    {errors.password && <span className="label-text-alt text-red-500">{errors.password.message}</span>}
                </div>

                <div>
                    <p className="font-medium text-sm mb-1 ml-1">Confirm Password</p>
                    <input {...register("confirmPassword")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="password" />
                    {errors.confirmPassword && <span className="label-text-alt text-red-500">{errors.confirmPassword.message}</span>}
                </div>

                <button className="button-filled rounded-full py-3 w-full">
                    Sign Up
                </button>

                <div className="flex self-center">
                    <p className="text-sm">Already have an account? <span className="button-colored font-medium p-0"><Link to={'/sign-in'}>Sign in now.</Link></span></p>
                </div>
                </form>
        </div>
    )
}

export default SignUp;