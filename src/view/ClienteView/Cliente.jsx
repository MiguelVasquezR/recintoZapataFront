import React, { useEffect, useState, useRef } from "react";
import { IoIosAdd } from "react-icons/io";
import { FcDocument } from "react-icons/fc";
import { CiLogout } from "react-icons/ci";
import Loader from "../../Loader/Loader";
import Logo from "../../images/Logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Espera from "../../images/Espera";
import appFirebase from '../../hooks/Firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Listo from '../../images/Listo.png'
const storage = getStorage(appFirebase);

const Cliente = () => {
    const [evento, setEvento] = useState({});
    const [existeDocumentacion, setExisteDocumentacion] = useState();
    const [existeComprobante, setExisteComprobante] = useState();
    const [confirmacion, setConfirmacion] = useState();
    const navigate = useNavigate();
    const [linksDocumentos, setLinksDocumentos] = useState({});
    const [getComprobante, setGetComprobante] = useState(false);

    const refContrato = useRef(null);
    const refReglamento = useRef(null);
    const refIdentificacion = useRef(null);
    const redComprobante = useRef(null);

    const [documentos, setDocumentos] = useState({
        contrato: { url: null, isLoading: false },
        reglamento: { url: null, isLoading: false },
        identificacion: { url: null, isLoading: false },
        comprobante: { url: null, isLoading: false }
    });

    // Método para solicitar la información del evento
    useEffect(() => {
        const obtenerEvento = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get(`http://${import.meta.env.VITE_IP}/evento/obtenerEventoIDToken?token=${token}`);
                    const evento = response.data;
                    setEvento(evento);
                } catch (error) {
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        };
        obtenerEvento();
    }, []);

    //Método para agregar Información
    const agregarDocumento = async (e) => {
        const targetName = e.target.name;
        const { isLoading, url } = documentos[targetName];

        if (!isLoading) {
            setDocumentos(prevState => ({
                ...prevState,
                [targetName]: { ...prevState[targetName], isLoading: true }
            }));

            const file = e.target.files[0];

            if (file.type !== 'application/pdf') {
                console.error('Solo se permiten archivos PDF.');
                return;
            }

            const refArchivo = ref(storage, `archivos/${evento.nombre}/${file.name}`);
            await uploadBytes(refArchivo, file);
            const urlDescarga = await getDownloadURL(refArchivo);

            await setDocumentos(prevState => ({
                ...prevState,
                [targetName]: { url: urlDescarga, isLoading: false }
            }));
        }
    };

    const realizarPeticionAPI = async (endpoint, data) => {
        try {
            const response = await axios.post(endpoint, data);
            return response.data.message === 'Documentacion creada';
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    useEffect(() => {
        if (documentos.contrato.url && documentos.identificacion.url && documentos.reglamento.url) {
            const data = {
                id_evento: evento.IDEvento,
                linkContrato: documentos.contrato.url,
                linkINE: documentos.identificacion.url,
                linkReglamente: documentos.reglamento.url,
            }
            realizarPeticionAPI(`http://${import.meta.env.VITE_IP}/documentos/crear?token=${localStorage.getItem('token')}`, data)
                .then(documentacionCreada => {
                    if (documentacionCreada) {
                        setDocumentos({
                            contrato: { url: null, isLoading: false },
                            reglamento: { url: null, isLoading: false },
                            identificacion: { url: null, isLoading: false },
                            comprobante: { url: null, isLoading: false }
                        });
                    }
                });
        }

        if (documentos.comprobante.url) {
            const data = {
                id_evento: evento.IDEvento,
                linkComprobante: documentos.comprobante.url,
            }
            realizarPeticionAPI(`http://${import.meta.env.VITE_IP}/documentos/crear-comprobante?token=${localStorage.getItem('token')}`, data)
                .then(comprobanteCreado => {
                    if (comprobanteCreado) {
                        setDocumentos(prevState => ({
                            ...prevState,
                            comprobante: { url: null, isLoading: false }
                        }));
                    }
                });
        }
    }, [evento, documentos]);

    //Método para verificar la existencia de la documentación
    useEffect(() => {
        const verificarDocumentacion = async () => {
            try {
                const responseDoc = await axios.get(`http://${import.meta.env.VITE_IP}/documentos/verificar-existencia-documentacion?id=${evento?.IDEvento}`);
                const dataResponseDic = await responseDoc.data;
                if (dataResponseDic.mensaje === 'Existe') {
                    setExisteDocumentacion(true);
                } else {
                    setExisteDocumentacion(false);
                }


                const responseComprobante = await axios.get(`http://${import.meta.env.VITE_IP}/documentos/verificar-existencia-comprobante?id=${evento?.IDEvento}`);
                const dataResponseComprobante = await responseComprobante.data;
                if (dataResponseComprobante.mensaje === 'Completo') {
                    setExisteComprobante("Completo");
                } else if (dataResponseComprobante.mensaje === 'Falta') {
                    setExisteComprobante("Falta");
                } else if (dataResponseComprobante.mensaje === 'No existe') {
                    setExisteComprobante("No Existe");
                }

            } catch (error) {
                console.error(error);
            }
        };

        verificarDocumentacion();
    }, [evento]);

    // Función para obtener sus documentos
    const obtenerDocumento = async () => {
        if (localStorage.getItem('token')) {
            axios({
                url: `http://${import.meta.env.VITE_IP}/descargarArchivos?token=${localStorage.getItem('token')}`,
                method: 'GET',
                responseType: 'blob',
            })
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'documentacion.zip');
                    document.body.appendChild(link);
                    link.click();
                })
                .catch(error => console.error(error));
        }
    }

    //Obtener comprobante
    const obtenerComprobante = async () => {
        if (localStorage.getItem('token')) {
            axios({
                url: `http://${import.meta.env.VITE_IP}/comprobante?token=${localStorage.getItem('token')}`,
                method: 'GET',
                responseType: 'blob',
            })
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'comprobante-pago.pdf');
                    document.body.appendChild(link);
                    link.click();
                })
                .catch(error => console.error(error));
        }
    }

    // Función para obtener la verificación de documentos
    useEffect(() => {
        axios.get(`http://${import.meta.env.VITE_IP}/confirmacionDoc/obtener-validez?id=${evento?.IDEvento}`)
            .then((res) => {
                setConfirmacion(res.data);
                if(res.data.estatusComprobante1 === "Aceptado" && res.data.estatusComprobante2 === "Aceptado"){
                    setGetComprobante(true);
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }, [evento])

    const MensajeEsperar = () => (
        <div className="bg-primary w-[100%] flex flex-row justify-center items-center gap-5 text-secondary rounded-md p-2">
            <Espera w={30} color={"white"} />
            <p>Documento en Espera</p>
        </div>
    );

    const MensajeAprobado = () => {
        return (
            <div className="bg-primary w-[100%] flex flex-row justify-center items-center gap-5 text-secondary rounded-md p-2">
                <img src={Listo} className="w-[40px] object-cover" />
                <p>Documento Aprobado</p>
            </div>
        );
    }

    //Método para agregar los links y comprobar si existen o no
    useEffect(()=>{
        axios.get(`http://${import.meta.env.VITE_IP}/documentos/obtener-documentacion?id=${evento?.IDEvento}`)
        .then((res)=>{
            setLinksDocumentos(res.data);
        })
        .catch((error)=>{
            console.error(error);
        })
    }, [evento])

    return (
        <>
            <div className="flex flex-row items-center justify-between w-full px-5 bg-primary">
                <picture><img src={Logo} className="w-[100px]" /></picture>
                <div className="flex flex-col items-center justify-center text-secondary" onClick={() => { localStorage.removeItem('token'); navigate("/login") }}>
                    <CiLogout size={30} />
                    <p className="text-[12px]">Cerrar Sesión</p>
                </div>

            </div>

            <section className="flex flex-col items-center justify-center gap-5 my-5 text-secondary">
                <p className="text-[#000] font-bold text-2xl">Hola, {evento?.nombre}</p>
                {
                    evento?.estado === 'Cancelado' ? <p className="text-secondary bg-[#FF0000]/80 w-[90%] mx-auto py-3 rounded-md text-center font-bold">Su evento ha sido cancelado</p> : null
                }

                {
                    getComprobante && <button onClick={obtenerComprobante}  
                    className="bg-primary w-[90%] py-3 rounded-md">Obtener Comprobante de Pago</button>
                }
                

                <div className="flex flex-row justify-center items-center gap-5 w-[90%]">
                    <button className="bg-primary w-[50%] py-3 rounded-md" onClick={obtenerDocumento}>Obtener Documentos</button>
                    <button className="bg-primary w-[50%] py-3 rounded-md" onClick={() => { navigate(`/cliente-view/editar?id=${evento?.IDEvento}`) }}>Editar Evento</button>
                </div>
                <article className="leading-8 text-[#000]" >
                    <p className="text-xl font-bold">Esta es la información de su evento:</p>
                    <p className="ml-5" >Fecha: {evento?.fecha} </p>
                    <p className="ml-5" >Hora de Inicio: {evento?.horaInicio}</p>
                    <p className="ml-5" >Cantidad de Personas: {evento?.cantidadPersona}</p>
                    <p className="ml-5" >Precio de su evento: ${evento?.precio}</p>
                </article>
            </section>

            <section className="mx-auto w-[90%] flex flex-col justify-center gap-5">
                <p className="font-bold text-[18px]">Recuerda subir su documentación</p>

                <form action="" className="flex flex-col items-center justify-center gap-5">

                    {
                        confirmacion?.estatusContrato === 'Aceptado' ? <MensajeAprobado /> : (
                            existeDocumentacion && linksDocumentos?.linkContrato ?
                                <MensajeEsperar />
                                :
                                <div className="w-[100%]">
                                    <input name="contrato" type="file" onChange={agregarDocumento} style={{ display: 'none' }} ref={refContrato} />
                                    <div className="flex flex-row items-center justify-center gap-4">
                                        {
                                            documentos.contrato.url ? <FcDocument size={50} /> : null
                                        }
                                        {
                                            documentos.contrato.isLoading ? <Loader /> : null
                                        }
                                        <button disabled={documentos.contrato.url ? true : false} className="bg-primary w-[100%] p-2 text-secondary rounded-md flex flex-row justify-center items-center" onClick={(e) => { e.preventDefault(); refContrato.current.click() }}> <IoIosAdd size={30} /> Subir Contrato</button>
                                    </div>
                                </div>
                        )
                    }


                    {
                        confirmacion?.estatusReglamento === 'Aceptado' ? <MensajeAprobado /> : (
                            existeDocumentacion && linksDocumentos?.linkReglamente ?
                                <MensajeEsperar />
                                :
                                <div className="w-[100%]">
                                    <input name="reglamento" type="file" onChange={agregarDocumento} style={{ display: 'none' }} ref={refReglamento} />


                                    <div className="flex flex-row items-center justify-center gap-4">
                                        {
                                            documentos.reglamento.url ? <FcDocument size={50} /> : ""
                                        }
                                        {
                                            documentos.reglamento.isLoading ? <Loader /> : ""
                                        }
                                        <button disabled={documentos.reglamento.url ? true : false} className="bg-primary w-[100%] p-2 text-secondary rounded-md flex flex-row justify-center items-center" onClick={(e) => { e.preventDefault(); refReglamento.current.click() }}> <IoIosAdd size={30} /> Subir Reglamento</button>
                                    </div>

                                </div>
                        )}

                    {
                        confirmacion?.estatusINE === 'Aceptado' ? <MensajeAprobado /> : (
                            existeDocumentacion && linksDocumentos?.linkINE ?
                                <MensajeEsperar />
                                :
                                <div className="w-[100%]">
                                    <input name="identificacion" type="file" onChange={agregarDocumento} style={{ display: 'none' }} ref={refIdentificacion} />


                                    <div className="flex flex-row items-center justify-center gap-4">
                                        {
                                            documentos.identificacion.url ? <FcDocument size={50} /> : ""
                                        }
                                        {
                                            documentos.identificacion.isLoading ? <Loader /> : ""
                                        }
                                        <button disabled={documentos.identificacion.url ? true : false} className="bg-primary w-[100%] p-2 text-secondary rounded-md flex flex-row justify-center items-center" onClick={(e) => { e.preventDefault(); refIdentificacion.current.click() }}> <IoIosAdd size={30} /> Subir Identificación</button>
                                    </div>

                                </div>
                        )}

                    {
                        confirmacion?.estatusComprobante1 === 'Aceptado' && confirmacion?.estatusComprobante2 === 'Aceptado' ? <MensajeAprobado /> : (
                            existeComprobante === "No Existe" || existeComprobante === "Falta" ?
                                <div className="w-[100%]">
                                    <input name="comprobante" type="file" onChange={agregarDocumento} style={{ display: 'none' }} ref={redComprobante} />
                                    <div className="flex flex-row items-center justify-center gap-4">
                                        {
                                            documentos.comprobante.url ? <FcDocument size={50} /> : ""
                                        }
                                        {
                                            documentos.comprobante.isLoading ? <Loader /> : ""
                                        }
                                        <button disabled={documentos.comprobante.url ? true : false} className="bg-primary w-[100%] p-2 text-secondary rounded-md flex flex-row justify-center items-center" onClick={(e) => { e.preventDefault(); redComprobante.current.click() }}> <IoIosAdd size={30} />{existeComprobante === "No Existe" ? "Subir Comprobante" : "Subir Último Comprobante"}</button>
                                    </div>
                                </div>
                                :
                                <MensajeEsperar />
                        )}

                </form>
            </section>

            {evento?.estado === 'En Modificacion' ? <p className="text-secondary bg-[#FF0000]/80 w-[90%] mx-auto py-3 rounded-md text-center font-bold my-5">Sus cambios deben ser aprovado por el administrador</p> : ""}

        </>
    );
};

export default Cliente;
