import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";

import Header from '../../componets/Header'

const CrearEvento = () => {
    const [btnBloqueado, setBtnBloqueado] = useState(false);
    const [paso, setPaso] = useState(1);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState('');
    const [fecha, setFecha] = useState();
    const [isDisponible, setIsDisponible] = useState();

    const styleInput = 'border-b-[1px] border-[#000] border-solid p-1 w-[90%] outline-none';
    const flex = 'flex flex-col justify-center items-center w-[90%] gap-4'

    useEffect(() => {
        if(localStorage.getItem("token")){
            axios.get(`http://${import.meta.env.VITE_IP}/validarToken?token=${localStorage.getItem("token")}`)
            .then((response)=>{
                if(response.data === "Cliente") navigate("/");
            })
            .catch((error)=>{console.log(error)})
        }
        axios.get(`http://${import.meta.env.VITE_IP}/evento/verificarFecha`)
            .then((res) => {
                setFecha(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])


    const onSubmit = (data) => {
        if (paso === 1) {
            setPaso(2);
        } else if (paso === 2) {
            setPaso(3);
        } else if (paso === 3) {
            formarData(data);
        }
    }

    const formarData = async (data) => {
        setIsDisponible('');
        const fechaOcupada = fecha.some(fechaOcupada => fechaOcupada === data.fecha);
        if (fechaOcupada) {
            console.log("Fecha no disponible");
            setIsDisponible('Fecha no disponible');
            return;
        }


        setBtnBloqueado(true);
        // Crear persona
        const persona = {
            nombre: data?.nombreCliente,
            paterno: data?.paternoCliente,
            materno: data?.maternoCliente,
            telefono: data?.telefono,
            email: data?.email
        };
        const resPersona = await axios.post(`http://${import.meta.env.VITE_IP}/persona/crear`, persona);
        const IDPersona = resPersona.data.id;

        // Crear dirección
        const direccion = {
            calle: data.calle,
            numero: data.numero,
            colonia: data.colonia,
            cp: data.cp,
            ciudad: data.ciudad,
            IDPersona: IDPersona
        };
        await axios.post(`http://${import.meta.env.VITE_IP}/direccion/crear`, direccion);

        // Crear evento
        const evento = {
            tipo: data.tipo,
            cantidadPersonas: data.cantidadPersonas,
            color: data.color,
            precio: data.precio,
            horaInicio: data.horaInicio,
            fecha: data.fecha,
            IDPersona: IDPersona
        };
        const resEvento = await axios.post(`http://${import.meta.env.VITE_IP}/evento/crear`, evento);
        const dataEvento = resEvento.data;

        if (dataEvento.mensaje === 'Completado') {
            navigate('/home');
        } else {
            setMensaje('Error al crear el evento');
        }


    }


    return (
        <>
            <Header />

            <IoMdArrowBack size={40} className='m-2' onClick={() => { navigate(-1) }} />

            <section>
                <h2 className='my-5 text-2xl font-bold text-center'>Agregar Evento</h2>
                {
                    isDisponible && <p className='bg-[red]/80 text-secondary p-1 rounded-md w-[90%] mx-auto my-2 text-center'>{isDisponible}</p>
                }
                <form onSubmit={handleSubmit(onSubmit)} action="" className='flex flex-col items-center justify-center gap-5'>

                    {
                        paso === 1 && <fieldset className={flex}>
                            <legend className='my-4 text-xl text-center'>Información Personal</legend>
                            <input {...register("nombreCliente", { required: true })} className={styleInput} type="text" placeholder='Nombre Cliente' />
                            <input {...register("paternoCliente", { required: true })} className={styleInput} type="text" placeholder='Apellido Paterno Cliente' />
                            <input {...register("maternoCliente", { required: true })} className={styleInput} type="text" placeholder='Apellido Materno Cliente' />
                            <input {...register("email", { required: true })} className={styleInput} type="email" placeholder='Correo Electrónico' />
                            <input {...register("telefono", { required: true })} className={styleInput} type="number" placeholder='Teléfono Celular' />
                        </fieldset>
                    }

                    {

                        paso === 2 && <fieldset className={flex}>
                            <legend className='my-4 text-xl text-center'>Dirección Cliente</legend>
                            <input {...register("calle", { required: true })} className={styleInput} type="text" placeholder='Calle' />
                            <input {...register("numero", { required: true })} className={styleInput} type="text" placeholder='Número' />
                            <input {...register("colonia", { required: true })} className={styleInput} type="text" placeholder='Colonia' />
                            <input {...register("cp", { required: true })} className={styleInput} type="number" placeholder='Código Postal' />
                            <input {...register("ciudad", { required: true })} className={styleInput} type="text" placeholder='Ciudad' />
                        </fieldset>

                    }

                    {
                        paso === 3 &&
                        <fieldset className={flex}>

                            <legend className='my-4 text-xl text-center'>Información del Evento</legend>

                            <div className='flex flex-col justify-center items-center gap-1 w-[100%]'>
                                <label htmlFor="">Fecha del Evento</label>
                                <input {...register("fecha", { required: true })} className={styleInput} type="date" placeholder='Fecha del Evento' />
                            </div>

                            <div className='flex flex-col justify-center items-center gap-1 w-[100%]'>
                                <label htmlFor="">Hora de Inicio</label>
                                <input {...register("horaInicio", { required: true })} className={styleInput} type="time" placeholder='Hora de Inicio' />
                            </div>

                            <div className='flex flex-col justify-center items-center gap-1 w-[100%]'>
                                <label htmlFor="">Seleccione la Cantidad de Personas</label>
                                <input {...register("cantidadPersonas", { required: true })} className={styleInput} type="number" placeholder='Cantidad de Personas' />
                            </div>


                            <div className='flex flex-col justify-center items-center gap-1 w-[100%]'>
                                <label htmlFor="">Seleccione Precio Total del Evento</label>
                                <input {...register("precio", { required: true })} className={styleInput} type="number" placeholder='Precio Total' />
                            </div>


                            <div className='flex flex-col justify-center items-center gap-1 w-[100%]'>
                                <label htmlFor="">Seleccione Tipo del Evento</label>
                                <input {...register("tipo", { required: true })} className={styleInput} type="text" placeholder='Tipo' />
                            </div>

                            <div className='flex flex-col justify-center items-center gap-1 w-[100%]'>
                                <label htmlFor="">Seleccione el Color del Evento</label>
                                <input {...register("color", { required: true })} className={styleInput} type="color" placeholder='Color' />
                            </div>


                        </fieldset>
                    }

                    <button disabled={btnBloqueado} type='submit' className='px-2 py-4 rounded-md bg-primary text-secondary'>Agregar Evento</button>

                    {
                        mensaje && <p>{mensaje}</p>
                    }

                </form>
            </section>

        </>
    )
}

export default CrearEvento