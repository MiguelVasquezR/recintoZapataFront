import React, { useEffect, useState } from 'react';

import Header from '../componets/Header';
import axios from 'axios';
import Alerta from '../images/Alerta'
import { useNavigate } from 'react-router-dom';

const Notificacion = () => {
    const [notificaciones, setNotificaciones] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        
        if(localStorage.getItem("token")){
            axios.get(`http://${import.meta.env.VITE_IP}/validarToken?token=${localStorage.getItem("token")}`)
            .then((response)=>{
                if(response.data === "Cliente") navigate("/");
            })
            .catch((error)=>{console.log(error)})
        }
        
        axios.get(`http://${import.meta.env.VITE_IP}/notificacion/listar`)
            .then(response => {
                setNotificaciones(response.data);
            })
            .catch(error => { console.log(error); });
            
    }, [])

    const actualizarEstatus = (notificacion) => {
        console.log(notificacion);
        const data = {
            ID: notificacion.IDNotificacion,
            estatus: 'Visto'
        }
        axios.post(`http://${import.meta.env.VITE_IP}/notificacion/actualizar-estatus`, data)
            .then(response => {
                console.log(response);
            })
            .catch(error => { console.log(error); });
    }

    return (
        <>
            <Header />
            <section>
                {
                    notificaciones &&
                    notificaciones.map((notificacion, index) => {
                        return (
                            <div key={index} onClick={(e)=>{actualizarEstatus(notificacion)}} className={`${notificacion.estatus === 'Pendiente' ? "bg-[#F0EDEC]" : 'bg-[#fff]'} text-[#000]/80 p-5 flex flex-row justify-center items-center gap-5`}>
                                <Alerta w={40} />
                                <div>
                                    <div className='flex flex-row items-center justify-between w-full font-bold'>
                                        <p>{notificacion?.titulo}</p>
                                        <p>{notificacion?.FechaNotificacion}</p>
                                    </div>
                                    <p className='text-[18px]'>El Sr(a) {notificacion?.nombre + " " + notificacion?.paterno + " " 
                                     + notificacion?.materno} {notificacion?.mensaje} programado para la fecha {notificacion?.FechaEvento}</p>
                                </div>
                            </div>
                        )
                    })
                }

            </section>


        </>
    )
}

export default Notificacion;