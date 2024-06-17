import React, { useState } from 'react';

import Header from '../../componets/Header';

import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";

const InformacionItemInventario = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const i =
    {
        id: 1,
        URL: 'https://via.placeholder.com/150',
        nombre: 'Item 1',
        cantidadTotal: 100,
        cantidadActual: 80,
        precioUnitario: 100
    }

    const modalAler = () => {

    }


    return (
        <>
            <Header />

            <section className='flex flex-col justify-center items-center gap-9 my-5'>
                <div className='relative w-screen'>
                    <IoChevronBack className='fixed cursor-pointer' onClick={() => { navigate(-1) }} size={35} />
                </div>

                <picture>
                    <img src={i.URL} className='w-[150px] h-[150px] rounded-[50%]' />
                </picture>

                <div className='flex flex-col gap-2'>
                    <h3 className='text-center text-xl font-bold'>{i.nombre}</h3>
                    <p className='text-base'>Cantidad Total: {i.cantidadTotal}</p>
                    <p className='text-base'>Cantidad Actual: {i.cantidadActual}</p>
                    <p className='text-base'>Precio Unitario: {i.precioUnitario}</p>
                </div>

                <div className='flex flex-row justify-center items-center gap-5'>
                    <button onClick={(e) => { setShowModal(true) }} className='bg-primary w-[100px] h-[35px] text-center text-secondary rounded-md' >Eliminar</button>
                    <button onClick={()=>{navigate(`/inventario/editar?id=${i.id}`)}} className='bg-primary w-[100px] h-[35px] text-center text-secondary rounded-md' >Editar</button>
                </div>

                {
                    showModal && (
                        <div className="z-50 shadow-md w-[90%] rounded-md fixed py-5 bg-[#f0f0f0]">
                            <div className="modal-content flex flex-col justify-center items-center gap-5">
                                <p className='font-bold text-2xl text-center'>¿Seguro que deseas eliminar este ítem?</p>
                                <div className='flex flex-row justify-center items-center gap-5'>
                                    <button className='cursor-pointer text-secondary bg-[red] px-4 py-2 rounded-md' onClick={()=>{setShowModal(false)}} >Cancelar</button>
                                    <button className='cursor-pointer text-secondary bg-primary px-4 py-2 rounded-md' >Aceptar</button>
                                </div>
                            </div>
                        </div>
                    )
                }

            </section>

        </>
    );
}

export default InformacionItemInventario;