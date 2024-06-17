import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from '../../images/Logo.png';
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const EditarEvento = () => {
    const [check, setCheck] = useState(false);
    const [verModal, setVerModal] = useState(false)
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const idEvento = params.get('id');

    const [cantidadPersonas, setCantidadPersonas] = useState(0)
    const [fecha, setFecha] = useState('')
    const [horaInicio, setHoraInicio] = useState('')
    const [estado, setEstado] = useState('')

    const [dataAnterior, setDataAnterior] = useState({
        cantidadPersonas: "",
        fecha: "",
        horaInicio: ""
    })

    const actualizarData = () => {
        if (check) {

            axios.post(`http://${import.meta.env.VITE_IP}/informacion-anterior/crear`, dataAnterior)
                .then((res) => {
                    if (!res.status(200)) {
                        return;
                    }
                })
                .catch((err) => { console.log(err); })

            const data = {
                id: idEvento,
                cantidadPersonas: cantidadPersonas,
                fecha: fecha,
                horaInicio: horaInicio,
                estado: 'En Modificacion'
            }

            axios.put(`http://${import.meta.env.VITE_IP}/evento/actualizarEventoCliente`, data)
                .then((res) => {
                    if (res.data === 'Se ha actualizado') {
                        console.log(res.data);
                        const fecha = new Date();
                        const fechaHoy = fecha.toLocaleDateString();
                        const notification = {
                            titulo: 'Evento Actualizado',
                            mensaje: 'solicita algunos cambios en su evento',
                            estatus: 'Pendiente',
                            fecha: fechaHoy,
                            id_evento: idEvento
                        }

                        axios.post(`http://${import.meta.env.VITE_IP}/notificacion/crear`, notification)
                            .then((res) => {
                                if (res.data.mensaje === 'Notificacion creada') {
                                    navigate('/cliente-view');
                                }
                            })
                            .catch((err) => { console.log(err); })

                    }
                })
                .catch((err) => {
                    console.log(err);
                })

        } else {
            setMensaje('Debe aceptar los terminos y condiciones')
        }
    }

    useEffect(() => {
        axios.get(`http://${import.meta.env.VITE_IP}/evento/obtenerEventoID?id=${idEvento}`)
            .then((res) => {
                setEstado(res.data.estado);
                setCantidadPersonas(res.data.cantidadPersona);
                setFecha(res.data.fecha);
                setHoraInicio(res.data.horaInicio);
                setDataAnterior({
                    id_evento: idEvento,
                    cantidadPersonas: res.data.cantidadPersona,
                    fecha: res.data.fecha,
                    horaInicio: res.data.horaInicio,
                    estatus: 'En Modificacion'
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }, [idEvento])

    const ModalCancelarEvento = () => {
        const [explicacion, setExplicacion] = useState();
        const [check, setCheck] = useState(false);
        const [btnBloqueado, setBtnBloqueado] = useState(true);

        const handleCancelar = (e) => {
            e.preventDefault();

            if (check === false) {
                alert('Debes aceptar los Términos y Condiciones para cancelar el evento.');
                return;
            }

            const data = {
                motivo: explicacion,
                id_evento: idEvento
            };

            axios.put(`http://${import.meta.env.VITE_IP}/evento/cancelar-evento`, data)
                .then((res) => {
                    if (res.data.mensaje === "Evento cancelado") {
                        alert('Evento cancelado');
                        setVerModal(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };


        return (
            <div className='absolute w-[400px] h-[250px] shadow-md bg-[#fff] flex flex-col justify-center items-center'>
                <label htmlFor="">Explique el motivo de cancelación</label>
                <textarea onChange={(e) => { setExplicacion(e.target.value); if (e.target.value.length >= 0) { setBtnBloqueado(false) } }} className='w-[90%] h-[200px] rounded-md border-[1px] border-solid border-[#000] p-1'></textarea>
                <div className='flex flex-row items-center justify-center gap-5 my-2'>
                    <input
                        id='tc'
                        type="checkbox"
                        checked={check}
                        onChange={(e) => setCheck(e.target.checked)}
                    />
                    <label htmlFor="tc">Acepto Términos y Condiciones</label>
                </div>
                <div className='flex flex-row items-center justify-center w-full gap-5 my-5 text-secondary'>
                    <button onClick={() => { setVerModal(false) }} className='w-[40%] h-[32px] bg-[red] rounded-md'>Cancelar</button>
                    <button onClick={handleCancelar} className='w-[40%] h-[32px] bg-primary rounded-md' disabled={btnBloqueado} >Aceptar</button>
                </div>
            </div>
        );
    }

    return (
        <>



            <div className="w-full px-2 bg-primary">
                <picture><img src={Logo} className="w-[100px]" /></picture>
            </div>

            <IoMdArrowBack size={40} onClick={() => { navigate(-1) }} className='my-5' />

            <h2 className='my-5 text-2xl font-bold text-center'>Editar Evento</h2>

            <section className='relative flex flex-col items-center justify-center gap-5'>
                {
                    estado === "Cancelado" && <p className='bg-[red]/80 p-4 text-secondary rounded-md'>No puedes modificar porque tu evento ha sido cancelado</p>
                }

                <form className='w-[90%] flex flex-col justify-center items-center gap-5'>
                    <div className='w-full'>
                        <label htmlFor="">Fecha:</label>
                        <input onChange={(e) => { setFecha(e.target.value) }} type="date" className='w-[100%] border-b-[1px] border-[#000] p-1' value={fecha} />
                    </div>
                    <div className='w-full'>
                        <label htmlFor="">Hora de Inicio:</label>
                        <input onChange={(e) => { setHoraInicio(e.target.value) }} type="time" className='w-[100%] border-b-[1px] border-[#000] p-1' value={horaInicio} />
                    </div>
                    <div className='w-full'>
                        <label htmlFor="">Seleccione la Cantidad de Personas</label>
                        <input onChange={(e) => { setCantidadPersonas(e.target.value) }} type="text" className='w-[100%] border-b-[1px] border-[#000] p-1' value={cantidadPersonas} />
                    </div>
                    <div className='flex flex-row items-center justify-center gap-5'>
                        <input id='terminos' type="checkbox" onClick={() => { setCheck(!check); setMensaje(''); }} />
                        <label htmlFor="terminos">Acepto los terminos y condiciones estipulados en el contrato</label>
                    </div>
                </form>

                {
                    <p>{mensaje}</p>
                }

                <div className='flex flex-row justify-center items-center gap-5 w-[90%]'>
                    <button onClick={() => { setVerModal(!verModal) }} className='w-[50%] py-3 bg-[#E37181] text-secondary rounded-md' disabled={estado === "Cancelado" ? true : false} >Cancelar Evento</button>
                    <button className='w-[50%] py-3 bg-primary text-secondary rounded-md' disabled={estado === "Cancelado" ? true : false} onClick={actualizarData}>Actualizar</button>
                </div>

                {
                    verModal && <ModalCancelarEvento />
                }

            </section>

        </>
    )

}

export default EditarEvento;