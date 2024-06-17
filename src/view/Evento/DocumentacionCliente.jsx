import React, { useEffect, useState } from 'react';
import Header from '../../componets/Header';
import axios from 'axios';
import appFirebase from '../../hooks/Firebase';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import Listo from '../../images/Listo.png';

const storage = getStorage(appFirebase);

const DocumentacionCliente = () => {
    const params = new URLSearchParams(window.location.search);
    const idEvento = params.get('id');
    const [documentacion, setDocumentacion] = useState();
    const [comprobante, setComprobante] = useState();
    const navigate = useNavigate();

    const [updateTrigger, setUpdateTrigger] = useState(false); // Estado para desencadenar el renderizado

    const [panelContrato, setPanelContrato] = useState(true);
    const [panelReglamento, setPanelReglamento] = useState(true);
    const [panelINE, setPanelINE] = useState(true);

    const [panelComprobante1, setPanelComprobante1] = useState(true);
    const [panelComprobante2, setPanelComprobante2] = useState(true);


    useEffect(() => {
        if(localStorage.getItem("token")){
            axios.get(`http://${import.meta.env.VITE_IP}/validarToken?token=${localStorage.getItem("token")}`)
            .then((response)=>{
                if(response.data === "Cliente") navigate("/");
            })
            .catch((error)=>{console.log(error)})
        }
        axios.get(`http://${import.meta.env.VITE_IP}/documentos/obtener-documentacion?id=${idEvento}`)
            .then((res) => {
                setDocumentacion(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        axios.get(`http://${import.meta.env.VITE_IP}/documentos/obtener-comprobante?id=${idEvento}`)
            .then((res) => {
                setComprobante(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://${import.meta.env.VITE_IP}/confirmacionDoc/obtener-validez?id=${idEvento}`)
            .then((res) => {
                if (res.data?.estatusContrato === 'Aceptado') {
                    setPanelContrato(false);
                }

                if (res.data?.estatusReglamento === 'Aceptado') {
                    setPanelReglamento(false);
                }

                if (res.data?.estatusINE === 'Aceptado') {
                    setPanelINE(false);
                }

                if (res.data?.estatusComprobante1 === 'Aceptado') {
                    setPanelComprobante1(false);
                }

                if (res.data?.estatusComprobante2 === 'Aceptado') {
                    setPanelComprobante2(false);
                }
            })
            .catch((err) => { console.log(err); });

    }, [comprobante, updateTrigger]); // Agregar updateTrigger como dependencia

    const handleDeleteFile = (fileUrl) => {
        const storageRef = ref(storage, fileUrl);
        deleteObject(storageRef)
            .then(() => {
                console.log("El archivo se ha borrado exitosamente.");
                setUpdateTrigger(prev => !prev); // Cambiar el valor de updateTrigger para desencadenar la recarga
            })
            .catch((error) => {
                console.error("Ocurrió un error al borrar el archivo:", error);
            });
    };

    const actualizarBD = (e) => {
        console.log(e);
        const data = {
            tipo: e.target.name
        }

        switch (e.target.name) {
            case 'contrato':
                axios.put(`http://${import.meta.env.VITE_IP}/documentos/modificarDocumentacion?id=${documentacion.ID}`, data)
                    .then((res) => { console.log(res); })
                    .catch((err) => { console.log(err); });

                break;
            case 'reglamento':
                axios.put(`http://${import.meta.env.VITE_IP}/documentos/modificarDocumentacion?id=${documentacion.ID}`, data)
                    .then((res) => { console.log(res); })
                    .catch((err) => { console.log(err); });

                break;
            case 'ine':
                axios.put(`http://${import.meta.env.VITE_IP}/documentos/modificarDocumentacion?id=${documentacion.ID}`, data)
                    .then((res) => { console.log(res); })
                    .catch((err) => { console.log(err); });

                break;
            case 'comprobanteUno':
                axios.delete(`http://${import.meta.env.VITE_IP}/documentos/eliminar-documentacion?id=${comprobante[0].id}`)
                    .then((res) => { console.log(res); })
                    .catch((err) => { console.log(err); });

                break;
            case 'comprobanteDos':
                axios.delete(`http://${import.meta.env.VITE_IP}/documentos/eliminar-documentacion?id=${comprobante[1].id}`)
                    .then((res) => { console.log(res); })
                    .catch((err) => { console.log(err); });
                break;
            default:
                console.log('default');
                break;
        }
    }

    const confirmarData = (e) => {
        const data = {
            id_evento: idEvento,
            campo: e.target.name,
            dato: "Aceptado"
        }

        axios.put(`http://${import.meta.env.VITE_IP}/confirmacionDoc/editarCampo`, data)
            .then((res) => {
                panelesView(e.target.name);
            })
            .catch((err) => {
                console.log(err);
            });

    }

    const panelesView = (panel) => {
        switch (panel) {
            case 'estatusContrato':
                setPanelContrato(false);
                break;
            case 'estatusReglamento':
                setPanelReglamento(false);
                break;
            case 'estatusINE':
                setPanelINE(false);
                break;
            case 'estatusComprobante1':
                setPanelComprobante1(false);
                break;
            case 'estatusComprobante2':
                setPanelComprobante2(false);
                break;
        }
    }

    useEffect(() => {
        
    }, [setPanelContrato, setPanelReglamento, setPanelINE, setPanelComprobante1, setPanelComprobante2]);

    return (
        <>
            <Header />

            <IoMdArrowRoundBack size={40} className='mt-5 ml-5' onClick={() => { navigate(-1) }} />

            <section className='flex flex-col items-center justify-center gap-5 my-1'>

                <div className='flex flex-col items-center justify-center gap-5 my-5'>
                    <h2 className='text-2xl font-bold'>Documentacion</h2>

                    {documentacion?.linkContrato &&
                        <div className='flex flex-col items-center justify-center gap-3 xl:w-[700px] xl:h-[1000px]'>
                            <p className='text-2xl font-bold'>Contrato</p>
                            <iframe src={documentacion?.linkContrato} frameBorder="0" className='w-[90%] h-[400px] xl:h-[1000px] bg-primary'></iframe>

                            {
                                panelContrato ?
                                    <div className='flex flex-row items-center justify-center gap-5 text-secondary'>
                                        <button name='contrato' onClick={async (e) => { await handleDeleteFile(documentacion?.linkContrato); await actualizarBD(e); }} className='p-2 w-[50%] rounded-md bg-[red]'>Corregir</button>
                                        <button disabled={!panelContrato} onClick={confirmarData} name='estatusContrato' className='p-2 w-[50%] rounded-md bg-primary/90'>Aceptar</button>
                                    </div>
                                    :
                                    <img src={Listo} className='w-[50px]' />
                            }

                        </div>
                    }

                    {documentacion?.linkReglamente && (
                        <div className='flex flex-col items-center justify-center gap-3 xl:w-[700px] xl:h-[1000px]'>
                            <p className='text-2xl font-bold'>Reglamento</p>
                            <iframe src={documentacion?.linkReglamente} frameBorder="0" className='w-[90%] h-[400px] xl:h-[1000px] bg-primary'></iframe>
                            {
                                panelReglamento ?
                                    <div className='flex flex-row items-center justify-center gap-5 text-secondary'>
                                        <button name='reglamento' onClick={async (e) => { await handleDeleteFile(documentacion?.linkReglamente); await actualizarBD(e); }} className='p-2 w-[50%] rounded-md bg-[red]'>Corregir</button>
                                        <button onClick={confirmarData} name='estatusReglamento' className='p-2 w-[50%] rounded-md bg-primary/90'>Aceptar</button>
                                    </div>
                                    :
                                    <img src={Listo} className='w-[50px]' />
                            }

                        </div>
                    )}

                    {documentacion?.linkINE && (
                        <div className='flex flex-col items-center justify-center gap-3 xl:w-[700px] xl:h-[1000px]'>
                            <p className='text-2xl font-bold'>Identificación</p>
                            <iframe src={documentacion?.linkINE} frameBorder="0" className='w-[90%] h-[400px] xl:h-[1000px] bg-primary'></iframe>
                            {
                                panelINE ?
                                    <div className='flex flex-row items-center justify-center gap-5 text-secondary'>
                                        <button name='ine' onClick={async (e) => { await handleDeleteFile(documentacion?.linkINE); await actualizarBD(e); }} className='p-2 w-[50%] rounded-md bg-[red]'>Corregir</button>
                                        <button onClick={confirmarData} name='estatusINE' className='p-2 w-[50%] rounded-md bg-primary/90'>Aceptar</button>
                                    </div>
                                    :
                                    <img src={Listo} className='w-[50px]' />
                            }
                        </div>
                    )}

                    {comprobante && comprobante[0] &&
                        <div className='flex flex-col items-center justify-center gap-3 my-5 xl:w-[700px] xl:h-[1000px]'>
                            <p className='text-2xl font-bold'>Comprobante 1</p>
                            <iframe src={comprobante[0]?.linkComprobante} frameBorder="0" className='w-[90%] h-[400px] xl:h-[1000px] bg-primary'></iframe>
                            {
                                panelComprobante1 ?

                                    <div className='flex flex-row items-center justify-center gap-5 text-secondary'>
                                        <button name={"comprobanteUno"} onClick={async (e) => { await handleDeleteFile(comprobante[0]?.linkComprobante); await actualizarBD(e); }} className='p-2 w-[50%] rounded-md bg-[red]'>Corregir</button>
                                        <button onClick={confirmarData} name={`estatusComprobante1`} className='p-2 w-[50%] rounded-md bg-primary/90'>Aceptar</button>
                                    </div>
                                    :
                                    <img src={Listo} className='w-[50px]' />


                            }

                        </div>
                    }

                    {
                        comprobante && comprobante[1] &&
                        <div className='flex flex-col items-center justify-center gap-3 my-5 xl:w-[700px] xl:h-[1000px]'>
                            <p className='text-2xl font-bold'>Comprobante 2</p>
                            <iframe src={comprobante[1]?.linkComprobante} frameBorder="0" className='w-[90%] h-[400px] xl:h-[1000px] bg-primary'></iframe>
                            {
                                panelComprobante2 ?
                                    <div className='flex flex-row items-center justify-center gap-5 text-secondary'>
                                        <button name={"comprobanteDos"} onClick={async (e) => { await handleDeleteFile(comprobante[1]?.linkComprobante); await actualizarBD(e); }} className='p-2 w-[50%] rounded-md bg-[red]'>Corregir</button>
                                        <button onClick={confirmarData} name={`estatusComprobante2`} className='p-2 w-[50%] rounded-md bg-primary/90'>Aceptar</button>
                                    </div>
                                    :
                                    <img src={Listo} className='w-[50px]' />
                            }
                        </div>
                    }


                </div>



            </section>

        </>
    )
}

export default DocumentacionCliente;
