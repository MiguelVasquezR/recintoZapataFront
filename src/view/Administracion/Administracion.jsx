import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import Header from '../../componets/Header';
import axios from 'axios';
import Imprimir from '../../images/impresora.png';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Administracion = () => {
    const { register, handleSubmit, reset } = useForm();
    const [fechaInicio, setFechaInicio] = useState();
    const [fechaFin, setFechaFin] = useState();
    const [mensajeConcepto, setMensajeConcepto] = useState();
    const [dataReporte, setDataReporte] = useState();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        axios.post(`http://${import.meta.env.VITE_IP}/administracion/crear`, data)
            .then((res) => {
                setMensajeConcepto(res.data)
                setTimeout(()=>{
                    if(res.data === "Concepto creado"){
                        setMensajeConcepto('');
                        reset();
                    }    
                }, [1000])                
            })
            .catch((err) => {
                console.log(err);
            })
    }
    
    function convertirFormatoFecha(fecha) {
        var partes = fecha.split('-');
        var nuevaFecha = partes[2] + '/' + partes[1] + '/' + partes[0];
        return nuevaFecha;
    }
    const generarReporte = () => {

        const data = {
            fechaInicio: convertirFormatoFecha(fechaInicio),
            fechaFin: convertirFormatoFecha(fechaFin)
        }
        axios.get(`http://${import.meta.env.VITE_IP}/administracion/reporte?inicio=${data.fechaInicio}&fin=${data.fechaFin}`)
            .then((res) => {
                setDataReporte(res.data);
            })
            .catch((err) => {
                console.log(err);
            })

    }
    const imprimirReporte = () => {
        const contenidoDiv = document.getElementById('reporteImpresion');
        var contenidoParaImprimir = contenidoDiv.cloneNode(true);
        var ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.body.appendChild(contenidoParaImprimir);
        ventanaImpresion.print();
    }

    useEffect(()=>{
        if(localStorage.getItem("token")){
            axios.get(`http://${import.meta.env.VITE_IP}/validarToken?token=${localStorage.getItem("token")}`)
            .then((response)=>{
                if(response.data === "Cliente") navigate("/");
            })
            .catch((error)=>{console.log(error)})
        }
    }, [])

    return (
        <>
            <Header />

            <div className='flex flex-col gap-5 p-5 lg:flex-row'>

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center gap-5 bg-primary shadow-md w-[90%] rounded-md my-5 mx-auto text-secondary py-5'>
                <legend className='text-2xl font-bold'>Administración</legend>
                <select {...register("tipo", { required: true })} className='bg-transparent border-b-[1px] border-[#fff] p-1 w-[70%] outline-none'>
                    <option className='text-[#000]' value="">Selecciona</option>
                    <option className='text-[#000]' value="Ingreso">Ingreso</option>
                    <option className='text-[#000]' value="Egreso">Egreso</option>
                </select>
                <input {...register("concepto", { required: true })} type="text" placeholder='Concepto' className='bg-transparent border-b-[1px] border-[#fff] p-1 w-[70%] outline-none' />
                <input {...register("cantidad", { required: true })} type="number" placeholder='Precio' className='bg-transparent border-b-[1px] border-[#fff] p-1 w-[70%] outline-none' />
                <button type='submit' className='border-[#fff] border-[1px] p-2 rounded-md'>Guardar</button>
                {
                    mensajeConcepto && <p>{mensajeConcepto}</p>
                }
            </form>

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center gap-5 bg-primary shadow-md w-[90%] rounded-md my-5 mx-auto text-secondary py-5'>
                <legend className='text-2xl font-bold'>Generar Reporte</legend>
                <input required onChange={(e) => { setFechaInicio(e.target.value) }} value={fechaInicio} type="date" placeholder='Fecha' className='bg-transparent outline-none border-b-[1px] border-[#fff] p-1 w-[70%]' />
                <input required onChange={(e) => { setFechaFin(e.target.value) }} value={fechaFin} type="date" placeholder='Fecha' className='bg-transparent outline-none border-b-[1px] border-[#fff] p-1 w-[70%]' />
                <button onClick={generarReporte} type='submit' className='border-[#fff] border-[1px] p-2 rounded-md'>Generar</button>
            </form>

            </div>

            <div id='reporteImpresion' className='w-[90%] mx-auto'>
                {
                    dataReporte &&
                    <>
                        <div className='flex flex-row items-center justify-between gap-5 px-5'>
                            <p className='my-5 text-2xl font-bold text-center'>Reporte</p>
                            <img src={Imprimir} className='w-[35px]' onClick={imprimirReporte} />
                        </div>
                        <table className='w-[90%] mx-auto my-5'>
                            <thead>
                                <tr className='w-[90%]'>
                                    <th className='border-[1px] border-solid text-center'>Fecha</th>
                                    <th className='border-[1px] border-solid text-center'>Concepto</th>
                                    <th className='border-[1px] border-solid text-center'>Tipo</th>
                                    <th className='border-[1px] border-solid text-center'>Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataReporte && dataReporte.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className='border-[1px] border-solid text-center'>{item.fecha}</td>
                                                <td className='border-[1px] border-solid text-center'>{item.concepto}</td>
                                                <td className='border-[1px] border-solid text-center'>{item.tipo}</td>
                                                <td className='border-[1px] border-solid text-center'>${item.cantidad}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </>
                }
            </div>

        </>
    )
}

export default Administracion;