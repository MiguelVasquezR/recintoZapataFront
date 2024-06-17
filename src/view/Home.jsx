import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

import Header from '../componets/Header.jsx';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const localizer = dayjsLocalizer(dayjs);
import { FaAngleRight } from "react-icons/fa";

import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { TiDeleteOutline } from "react-icons/ti";
import { CiCalendar } from "react-icons/ci";

//Componentes para realizar el reporte de una multa
const MultaEvento = ({ evento }) => {
    const [tipo, setTipo] = useState();
    const [cantidad, setCantidad] = useState();
    const [mensaje, setMensaje] = useState();

    const crearMulta = (e) => {
        e.preventDefault();
        const data = {
            tipo: tipo,
            cantidad: cantidad,
            id_evento: evento.IDEvento
        }

        axios.post(`http://${import.meta.env.VITE_IP}/multa/crear`, data)
            .then((response) => {
                setMensaje(response.data.mensaje)
            })
            .catch((error) => { console.log(error) })
    }

    return (
        <form onSubmit={crearMulta} className='w-[90%] flex flex-col justify-center items-center gap-4'>
            <select value={tipo} onChange={(e) => { setTipo(e.target.value) }} name="" id="" className='w-[90%] bg-transparent border-b-[1px] border-b-[#fff] border-solid p-1 outline-none'>
                <option className='text-[#000]' value="">Selecciona</option>
                <option className='text-[#000]' value="residuos">Residuos</option>
                <option className='text-[#000]' value="regurgiten">Regurgiten</option>
                <option className='text-[#000]' value="emisoraSonido">Emisora de Sonido</option>
            </select>
            <input value={cantidad} onChange={(e) => { setCantidad(e.target.value) }} className='w-[90%] bg-transparent border-b-[1px] border-b-[#fff] border-solid p-1 placeholder:text-[#fff] outline-none' type="number" placeholder='Ingrese la cantidad de multa' />
            <button type='submit' className='border-[1px] border-solid border-[#fff] rounded-md p-2'>Guardar</button>
            {
                mensaje && <p className='my-3 bg-[red] p-1 rounded-md'>{mensaje}</p>
            }
        </form>
    )
}
//Componentes para realizar la hora extra
const HoraExtra = ({ evento }) => {
    const [horaExtra, setHoraExtra] = useState();
    const [cantidad, setCantidad] = useState();
    const [mensaje, setMensaje] = useState();

    const agregarHoraExtra = (e) => {
        e.preventDefault();
        const data = {
            horaExtra: horaExtra,
            precio: cantidad,
            id_evento: evento.IDEvento
        }
        axios.post(`http://${import.meta.env.VITE_IP}/hora-extra/crear`, data)
            .then((response) => {
                setMensaje(response.data.mensaje)
            })
            .catch((error) => { console.log(error) })
    }

    return (
        <form onSubmit={agregarHoraExtra} className='w-[90%] flex flex-col justify-center items-center gap-4'>
            <input value={horaExtra} onChange={(e) => { setHoraExtra(e.target.value) }} className='w-[90%] bg-transparent border-b-[1px] border-b-[#fff] border-solid p-1 placeholder:text-[#fff] outline-none' type="number" placeholder='Ingrese la cantidad de horas' />
            <input value={cantidad} onChange={(e) => { setCantidad(e.target.value) }} className='w-[90%] bg-transparent border-b-[1px] border-b-[#fff] border-solid p-1 placeholder:text-[#fff] outline-none' type="number" placeholder='Ingrese la cantidad' />
            <button type='submit' className='border-[1px] border-solid border-[#fff] rounded-md p-2'>Guardar</button>
            {
                mensaje && <p className='my-3 bg-[red] p-1 rounded-md'>{mensaje}</p>
            }
        </form>
    )
}
//Componentes para realizar la cancelación de un evento
const CancelacionEvento = ({ evento }) => {
    const [motivo, setMotivo] = useState();
    const [mensaje, setMensaje] = useState();

    const cancelarEvento = (e) => {
        e.preventDefault();
        const data = {
            motivo: motivo,
            id_evento: evento.IDEvento
        }
        axios.put(`http://${import.meta.env.VITE_IP}/evento/cancelar-evento`, data)
            .then((res) => {
                if (res.data.mensaje === "Evento cancelado") {
                    setMensaje(res.data.mensaje);
                } else {
                    setMensaje(res.data.mensaje);
                }
            })
            .catch((error) => { console.log(error) })
    }

    return (
        <form onSubmit={cancelarEvento} className='w-[90%] flex flex-col justify-center items-center gap-4'>
            <textarea value={motivo} onChange={(e) => { setMotivo(e.target.value) }} className='w-[90%] bg-transparent border-[1px] border-[#fff] border-solid p-2 placeholder:text-[#fff] rounded-md outline-none h-[200px]' type="text" placeholder='Explica el motivo de la cancelación' />
            <button type='submit' className='border-[1px] border-solid border-[#fff] rounded-md p-2'>Guardar</button>
            {mensaje && <p className='my-3 bg-[red] p-1 rounded-md'>{mensaje}</p>}
        </form>
    )
}

// Componente principal
const MyCalendar = () => {
    const [eventos, setEvento] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [infoAnterior, setInfoAnterior] = useState([]);
    const [diaEvento, setDiaEvento] = useState('');
    const [opcionesProblema, setOpcionesProblema] = useState(false);
    const [operacionesExtra, setOperacionesExtra] = useState();
    const navigate = useNavigate();

    useEffect(() => {

        if (localStorage.getItem("token")) {
            axios.get(`http://${import.meta.env.VITE_IP}/validarToken?token=${localStorage.getItem("token")}`)
                .then((response) => {
                    if (response.data === "Cliente") navigate("/");
                })
                .catch((error) => { console.log(error) })
        }else{
            navigate("/");
        }


        const obtenerEventos = async () => {
            try {
                const response = await axios.get(`http://${import.meta.env.VITE_IP}/evento/obtener`);
                setEvento(response.data.map(evento => ({
                    id: evento.id,
                    title: evento.tipo,
                    start: new Date(evento.fecha + 'T' + evento.horaInicio), // Concatenar fecha y horaInicio en formato ISO
                    end: new Date(evento.fecha + 'T' + evento.horaInicio), // Puedes ajustar el final del evento según su duración
                    cantidadPersonas: evento.cantidadPersonas,
                    color: evento.color,
                    precio: evento.precio,
                    IDPersona: evento.IDPersona
                })));
            } catch (error) {
                console.log(error);
            }
        };

        obtenerEventos();
    }, []);

    useEffect(() => {
        const hoy = new Date();

        eventos.map((evento) => {
            const fechaEvento = new Date(evento.start);
            const esHoy = hoy.getFullYear() === fechaEvento.getFullYear() &&
                hoy.getMonth() === fechaEvento.getMonth() &&
                hoy.getDate() === fechaEvento.getDate();
            if (esHoy) {
                axios.get(`http://${import.meta.env.VITE_IP}/evento/obtenerEventoID?id=${evento.id}`)
                    .then((response) => {
                        setDiaEvento(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        })

    }, [eventos])


    const CustomToolbar = ({ label, onNavigate, onView }) => (
        <div className='flex flex-col items-center justify-center gap-5 md:flex-row md:justify-between md:my-4'>
            <div className='flex flex-row gap-4 text-secondary'>
                <button className='p-2 rounded-lg bg-primary' onClick={() => onNavigate('PREV')}>Anterior</button>
                <button className='p-2 rounded-lg bg-primary' onClick={() => onNavigate('TODAY')}>Hoy</button>
                <button className='p-2 rounded-lg bg-primary' onClick={() => onNavigate('NEXT')}>Siguiente</button>
            </div>
            <h2 className='text-2xl font-bold md:inline'>{label}</h2>
        </div>
    );

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: event.color,
            borderRadius: '5px',
            color: 'white',
            border: 'none',
            display: 'block'
        };
        return {
            style
        };
    };

    const handleSelectEvent = (event, e) => {
        axios.get(`http://${import.meta.env.VITE_IP}/evento/obtenerEventoID?id=${event.id}`)
            .then((response) => {
                setSelectedEvent(response.data);
                axios.get(`http://${import.meta.env.VITE_IP}/informacion-anterior/listar?id=${event.id}`)
                    .then((response) => {
                        if (response.data.mensaje !== "Error") {
                            setInfoAnterior(response.data);
                        } else {
                            setInfoAnterior(null);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log(error);
            })
    };

    const ModalEliminar = ({id}) => {

        const [motivo, setMotivo] = useState(false);
        const [explicacion, setExplicacion] = useState();


        const deleteEvent = (e) => {
            e.preventDefault();
            const data = {
                motivo: explicacion,
                id_evento: id
            }
            
            axios.put(`http://${import.meta.env.VITE_IP}/evento/cancelar-evento`, data)
                .then((res) => {
                    if (res.data.mensaje === "Evento cancelado") {
                        setMostrarModal(false)
                    }
                })
                .catch((error) => { console.log(error) })
        }

        return (
            <div className='bg-[#fff] shadow-md rounded-md w-[90%] h-[300px] p-5 flex flex-col justify-center items-center gap-5 fixed z-50  left-0 right-0 bottom-0 top-0 m-auto max-w-[400px]'>
                <h2>¿Estás seguro de eliminar el evento?</h2>
                {
                    motivo ?
                        <form className='flex flex-col items-center justify-center w-[100%]' >
                            <label htmlFor="">Explica el motivo de cancelación</label>
                            <textarea onChange={(e)=>{setExplicacion(e.target.value)}} className='border-[1px] border-solid border-[#000] rounded-md w-[90%] h-[150px]' name="" id=""></textarea>
                            <div className='text-[#fff] w-[90%] flex flex-row gap-3 my-5'>
                                <button onClick={() => (setMostrarModal(false))} className='bg-[red] w-[50%] h-[32px] rounded-md'>Cancelar</button>
                                <button onClick={deleteEvent} className='bg-primary w-[50%] h-[32px] rounded-md'>Aceptar</button>
                            </div>
                        </form>
                        :
                        <div className='flex flex-row gap-5'>
                            <button onClick={() => { setMostrarModal(false) }} className='px-2 py-4 rounded-md shadow-md' >Cancelar</button>
                            <button onClick={() => { setMotivo(!motivo) }} className='px-2 py-4 rounded-md bg-primary text-secondary' >Eliminar</button>
                        </div>
                }
            </div>
        );
    }

    const aceptarCambiosEvento = () => {
        axios.delete(`http://localhost:4567/informacion-anterior/eliminar?id=${selectedEvent.IDEvento}`)
            .then((response) => {
                if (response.data.mensaje === 'InformacionAnterior eliminada') {
                    selectedEvent.estado = "Aceptado";
                    console.log(selectedEvent);
                    axios.put(`http://${import.meta.env.VITE_IP}/evento/actualizarEventoCliente`, selectedEvent)
                        .then((response) => {
                            console.log(response.data);
                        })
                        .catch((error) => { console.log(error) })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    //Componente para mostrar una tarjeta con la información del evento del día y realizar operaciones extra
    const EventoHoy = () => {
        return (
            <div className='bg-primary text-secondary p-2 rounded-md flex flex-col justify-center items-center gap-5 w-[90%] shadow-xl mx-auto my-5 lg:w-[60%]'>

                <p className='text-xl font-bold'>Evento del Día</p>

                <div className='flex flex-col items-center gap-5 justify-evenly lg:flex-row w-[100%]'>


                    <article>
                        <h3 className='font-bold text-[20px]'>Información del cliente</h3>
                        <p>Cliente: {diaEvento.nombre} {diaEvento.paterno} {diaEvento.materno}</p>
                        <p>Teléfono: {diaEvento.telefono}</p>
                        <p>Correo: {diaEvento.email}</p>
                    </article>

                    <article>
                        <h3 className='font-bold text-[20px]'>Información del Evento</h3>
                        <p>Tipo: {diaEvento.tipo}</p>
                        <p>Inicia: {diaEvento.horaInicio}</p>
                        <p>Cantidad de Personas: {diaEvento.cantidadPersona}</p>
                        <p>Precio: ${diaEvento.precio}</p>
                    </article>

                </div>

                <button onClick={() => { setOpcionesProblema(!opcionesProblema) }} className={`${opcionesProblema ? "bg-transparent" : "bg-secondary text-[#000]"} border-[#fff] border-[1px] border-solid p-2 rounded-md my-5`}>Operaciones Extra</button>

                {
                    opcionesProblema &&
                    <div className='w-[80%] my-5 outline-none'>
                        <select value={operacionesExtra} onChange={(e) => { setOperacionesExtra(e.target.value) }} name="" id="" className='text-[#fff] bg-transparent w-[100%] border-b-[1px] border-b-[#fff] p-1 outline-none'>
                            <option className='text-[#000]' value="">Selecciona</option>
                            <option className='text-[#000]' value="cancelacion">Cancelación</option>
                            <option className='text-[#000]' value="horaExtra">Hora Extra</option>
                            <option className='text-[#000]' value="multa">Multa</option>
                        </select>
                    </div>
                }

                {
                    operacionesExtra === 'cancelacion' && <CancelacionEvento evento={diaEvento} />
                }
                {
                    operacionesExtra === 'horaExtra' && <HoraExtra evento={diaEvento} />
                }
                {
                    operacionesExtra === 'multa' && <MultaEvento evento={diaEvento} />
                }

            </div>
        );
    }

    

    return (
        <>
            <Header /> 

            {
                diaEvento.estado !== "Cancelado" && <EventoHoy />
            }

            <section className='relative flex flex-col'>

                <div className='m-4 bg-primary p-2 text-secondary rounded-md flex flex-row justify-center items-center gap-1 w-[200px]'>
                    <CiCalendar color='white' size={30} />
                    <Link to={"/evento/crear"} >Agregar Evento</Link>
                </div>

                <section className='flex flex-col items-center justify-center xl:flex-row xl:my-5'>

                    <div className='w-[90%] h-[500px] mx-auto mt-5 max-w-[600px] md:w-[50%] md:h-[750px]'>
                        <Calendar
                            events={eventos}
                            startAccessor='start'
                            endAccessor='end'
                            views={['month', 'week', 'day']}
                            defaultView='month'
                            toolbar={true}
                            eventPropGetter={eventStyleGetter}
                            components={{ toolbar: CustomToolbar }}
                            localizer={localizer}
                            onSelectEvent={handleSelectEvent}
                        />
                    </div>

                    {selectedEvent !== null &&
                        <section className='bg-primary w-[90%] mx-auto my-5 rounded-md text-secondary flex flex-col gap-5 p-5 relative md:w-[50%]'>

                            {
                                selectedEvent.estado === 'Cancelado' &&
                                <p className='bg-[red]/90 w-[50%] text-center p-1 rounded-md'>El evento ha sido cancelado</p>
                            }


                            <div className='absolute flex flex-row items-center justify-center gap-2 top-4 right-1'>
                                <CiEdit onClick={(e) => { navigate(`/evento/editar?id=${selectedEvent.IDEvento}`) }} color='white' size={30} className='cursor-pointer' />
                                <MdDelete onClick={(e) => { setMostrarModal(true) }} color='white' size={30} className='cursor-pointer' />
                                <TiDeleteOutline onClick={(e) => { setSelectedEvent(null) }} color='white' size={30} className='cursor-pointer' />
                            </div>

                            <section>
                                <h2 className='font-bold text-[30px]'>{selectedEvent.tipo}</h2>
                                <div>
                                    <p className='text-[12px] text-[#fff]/50'>Fecha y Hora del Evento</p>
                                    <div className='flex flex-row gap-2'>
                                        <p>{infoAnterior ? infoAnterior?.fecha : ""} {infoAnterior ? <FaAngleRight className='' /> : ""}{selectedEvent.fecha}</p>
                                        <p>{infoAnterior ? infoAnterior?.horaInicio : ""} {infoAnterior ? <FaAngleRight className='' /> : ""}{selectedEvent.horaInicio}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className='text-[12px] text-[#fff]/50'>Cantidad de Personas</p>
                                    <p>{infoAnterior ? infoAnterior?.cantidadPersonas : ""} {infoAnterior ? <FaAngleRight className='inline-block' /> : ""} {selectedEvent.cantidadPersona}</p>
                                </div>
                                <div>
                                    <p className='text-[12px] text-[#fff]/50'>Precio del Evento</p>
                                    <p>$ {selectedEvent.precio}</p>
                                </div>
                            </section>

                            <section>
                                <h2 className='text-[20px] font-bold'>Información Cliente</h2>
                                <div>
                                    <p className='text-[12px] text-[#fff]/50'>Nombre del Cliente</p>
                                    <h3>{selectedEvent.nombre + " " + selectedEvent?.paterno + " " + selectedEvent?.materno}</h3>
                                </div>
                                <div>
                                    <p className='text-[12px] text-[#fff]/50'>Correo del Cliente</p>
                                    <p>{selectedEvent.email}</p>
                                </div>
                                <div>
                                    <p className='text-[12px] text-[#fff]/50'>Teléfono del Cliente</p>
                                    <p>{selectedEvent.telefono}</p>
                                </div>
                            </section>

                            <button className='border-[#fff] border-solid border-[1px] w-1/2 mx-auto rounded-md p-2' onClick={() => { navigate(`/documentacion-cliente?id=${selectedEvent.IDEvento}`) }}>Documentación</button>

                            {
                                selectedEvent?.estado === 'En Modificacion' &&
                                <div className='flex flex-col items-center justify-center gap-3'>
                                    <p className='text-[15px] text-[#fff]/50'>El cliente solicita algunos cambios</p>
                                    <button onClick={aceptarCambiosEvento} className='border-[#fff] border-[1px] rounded-md p-1 border-solid'>Aceptar Cambios</button>
                                </div>
                            }

                        </section>}
                </section>

                {mostrarModal && <ModalEliminar id={selectedEvent.IDEvento} />}

            </section>
        </>
    );


};

export default MyCalendar;
