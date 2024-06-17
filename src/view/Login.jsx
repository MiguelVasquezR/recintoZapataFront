import React from 'react';
import { Link } from 'react-router-dom';
import HeaderPagina from './PaginaWeb/HeaderPagina';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import axios from 'axios';


const Login = () => {

    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {

        const user = {
            usuario: data.usuario,
            contrasena: data.contrasena,
            token: localStorage.getItem('token')
        }

        axios.post(`http://${import.meta.env.VITE_IP}/usuario/iniciarSesion`, user)
        .then((res)=>{
            if(res.data.Mensaje === 'Sesión iniciada'){
                if(res.data?.token){
                    localStorage.setItem('token', res.data.token);
                }
                if(res.data.rol === 'Cliente'){
                    navigate('/cliente-view');
                }else if(res.data.rol === 'Administrador'){
                    navigate('/home');
                }
            }
        })
        .catch((error)=>{
            console.log(error);
        })

    }


    return (
        <>
            <HeaderPagina />
            <div className='flex justify-center items-center'>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center gap-5 shadow-md p-5 rounded-md w-[90%] mt-[50px]'>
                    <h2 className='text-primary text-[30px] my-5 font-bold'>Iniciar Sesión</h2>
                    <input {...register("usuario", {required: true})} className='border-b-[1px] border-solid border-[#000] w-[100%] p-1 outline-none' type="text" placeholder="Usuario" />
                    <input {...register("contrasena", {required: true})} className='border-b-[1px] border-solid border-[#000] w-[100%] p-1 outline-none' type="password" placeholder="Contraseña" />
                    <button type='submit' className='bg-primary p-2 rounded-md text-secondary'>Iniciar Sesión</button>
                    <p>U</p>
                    <Link className='border-b-[1px] text-primary text-[20px] font-bold' to={"/servicio"}>Obtener Servicio</Link>
                </form>
            </div>
        </>
    )
}

export default Login;