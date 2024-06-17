import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../componets/Header';
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";

const EditarEvento = () => {
    const params = new URLSearchParams(window.location.search);
    const idEvento = params.get('id');

    const [evento, setEvento] = useState();
    const styleInputs = 'w-[100%] border-b-[1px] border-[#000] p-1';

    const [fecha, setFecha] = useState();
    const [hora, setHora] = useState();
    const [cantidad, setCantidad] = useState();
    const [precio, setPrecio] = useState();
    
    const navigate = useNavigate();


    useEffect(() => {
        if(localStorage.getItem("token")){
            axios.get(`http://${import.meta.env.VITE_IP}/validarToken?token=${localStorage.getItem("token")}`)
            .then((response)=>{
                if(response.data === "Cliente") navigate("/");
            })
            .catch((error)=>{console.log(error)})
        }
        axios.get(`http://${import.meta.env.VITE_IP}/evento/obtenerEventoID?id=${idEvento}`)
            .then((res) => {
                setFecha(res.data.fecha);
                setHora(res.data.horaInicio);
                setCantidad(res.data.cantidadPersona);
                setPrecio(res.data.precio);

            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const obtenerData = (e) => {
        e.preventDefault();
        const evento = {
            id: idEvento,
            fecha,
            horaInicio: hora,
            cantidadPersonas: cantidad,
            precio
        }

        axios.put(`http://${import.meta.env.VITE_IP}/evento/actualizar`, evento)
            .then((res) => {
                if (res.status === 200) {
                    navigate('/home');
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            <Header />

            <IoMdArrowBack size={40} className='m-2' onClick={()=>{navigate(-1)}} />

            <form onSubmit={obtenerData} className='w-[90%] mx-auto my-5 flex flex-col gap-5'>

                <div className=''>
                    <label htmlFor="">Fecha</label>
                    <input value={fecha} onChange={(e)=>{setFecha(e.target.value)}} className={styleInputs} type="date"  />
                </div>

                <div>
                    <label htmlFor="">Hora de Inicio</label>
                    <input value={hora} onChange={(e)=>{setHora(e.target.value)}} className={styleInputs} type="time" />
                </div>

                <div>
                    <label htmlFor="">Cantidad de personas</label>
                    <input value={cantidad} onChange={(e)=>{setCantidad(e.target.value)}} className={styleInputs} type="number" placeholder='Ej. 300'  />
                </div>

                <div>
                    <label htmlFor="">Precio</label>
                    <input value={precio} onChange={(e)=>{setPrecio(e.target.value)}} className={styleInputs} type="number" />
                </div>

                <button className='bg-primary text-secondary py-2 px-4 rounded-md w-[50%] mx-auto my-5'>Actualizar Evento</button>

            </form>

        </>
    )
}

export default EditarEvento;