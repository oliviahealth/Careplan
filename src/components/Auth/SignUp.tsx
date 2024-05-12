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

    let { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({ resolver: zodResolver(SignUpSchema) });

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
        <div className="flex justify-center w-full p-2 mt-2 text-base font-OpenSans">

            <form onSubmit={handleSubmit((data) => mutate(data))} className="w-[40rem] md:w-[30rem] m-5 md:m-0 space-y-1 [&>p]:pt-6 [&>p]:pb-1 [&>input]:px-4">

                <p className="font-medium">Name</p>
                <input {...register("name")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="text" />
                {errors.name && <span className="label-text-alt text-red-500">{errors.name.message}</span>}

                <p className="font-medium">Email</p>
                <input {...register("email")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="text" />
                {errors.email && <span className="label-text-alt text-red-500">{errors.email.message}</span>}

                <p className="font-medium">Password</p>
                <input {...register("password")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="text" />
                {errors.password && <span className="label-text-alt text-red-500">{errors.password.message}</span>}

                <p className="font-medium">Confirm Password</p>
                <input {...register("confirmPassword")} className="border border-gray-300 px-4 py-2 rounded-md w-full" type="text" />
                {errors.confirmPassword && <span className="label-text-alt text-red-500">{errors.confirmPassword.message}</span>}

                <button className="btn btn-primary w-full mt-6">
                    Sign Up
                </button>

                <p className="text-sm mt-8">Have an account? <span className="text-primary"><Link to={'/sign-in'}>Sign In</Link></span></p>
            </form>
        </div>
    )
}

export default SignUp;