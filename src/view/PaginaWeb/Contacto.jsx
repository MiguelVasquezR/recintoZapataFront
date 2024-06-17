import React from 'react';

import HeaderPagina from './HeaderPagina';
import { FaPhone } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Contacto = () => {
    return (
        <>
            <HeaderPagina />
            <section className='flex flex-col justify-center items-center text-primary gap-5 my-5'>
                <h2 className='text-[20px] font-bold'>Nuestros contactos</h2>

                <article className='text-[#000] w-[80%] flex flex-col justify-center items-center gap-3 text-center'>
                    <div className='flex flex-row justify-center items-center gap-5'>
                        <FaPhone />
                        <p>2284069136</p>
                    </div>
                    <div className='flex flex-row justify-center items-center gap-5'>
                        <FaLocationDot />
                        <p>José Mancisidor 75 Bis, Xalapa, Veracruz, 91090</p>
                    </div>

                    <div className='flex flex-row justify-center items-center gap-5'>
                        <MdEmail />
                        <p>recintozapata@outlook.com</p>
                    </div>

                </article>


                <h2 className='text-[20px] font-bold'>O</h2>

                <p className='text-center text-primary font-bold my-5 text-[20px]'>Deja tu contacto y nos comunicamos</p>
                <form className='flex flex-col justify-center items-center gap-5 w-[90%] mx-auto'>
                    <input className='w-[100%] border-b-[1px] border-solid border-[#000]' type="text" placeholder='Nombre Interesado' />
                    <input className='w-[100%] border-b-[1px] border-solid border-[#000]' type="number" placeholder='Número de teléfono' />
                    <button className='bg-primary py-4 px-2 text-secondary rounded-md w-[50%]'>Enviar</button>
                </form>
            </section>
        </>
    );
}

export default Contacto;