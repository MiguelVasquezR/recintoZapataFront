import React from 'react';

import HeaderPagina from './HeaderPagina';
import Logo from '../../images/Logo.png'

const SobreNosotros = () => {
    return (
        <>
            <HeaderPagina />
            <section className='my-5'>
                <h2 className='text-primary font-bold text-[40px] mx-auto my-5 text-center'>¿Quiénes Somos?</h2>
                <picture>
                    <img src={Logo} className='w-[150px] mx-auto' />
                </picture>

                <article className='w-[90%] mx-auto text-justify flex flex-col gap-5'>
                    <div>
                        <h3 className='text-primary font-bold text-[20px]'>Nuestra Misión</h3>
                        <p>La misión de Recinto Zapata es ser una sala de eventos moderna y versátil, que transmita a anfitriones e invitados un ambiente de calidez, calma y tranquilidad, posicionándose como un espacio cómodo y de calidad, para realizar eventos cubriendo cada necesidad que se pueda presentar en el desarrollo de estos.</p>
                    </div>

                    <div>
                        <h3 className='text-primary font-bold text-[20px]'>Nuestros Valores</h3>
                        <ul className='flex flex-col gap-3'>
                            <li>Profesionalismo
                                <ul className='ml-5 list-disc'>
                                    <li>Brindar un servicio de alta calidad y trato profesional en la gestión de la renta de instalaciones para eventos.</li>
                                </ul>
                            </li>
                            <li>Eficiencia
                                <ul className='ml-5 list-disc'>
                                    <li>Garantizar una gestión ágil y eficiente de los procesos de reserva y preparativos para los eventos. Integridad: Actuar con honestidad y transparencia en todas las transacciones y compromisos relacionados con la renta de las instalaciones.</li>
                                </ul>
                            </li>
                            <li>Flexibilidad
                                <ul className='ml-5 list-disc'>
                                    <li>Adaptarse a las necesidades específicas de cada cliente, ofreciendo opciones personalizadas y flexibles para la configuración del espacio.</li>
                                </ul>
                            </li>
                            <li>Sostenibilidad
                                <ul className='ml-5 list-disc'>
                                    <li>Demostrar un fuerte compromiso con la protección del medio ambiente, implementando prácticas que reduzcan el impacto ambiental de las operaciones.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className='text-primary font-bold text-[20px]'>Nuestra Visión</h3>
                        <p>La visión de Recinto Zapata es consolidarse como marca referente de salones para realización de eventos, procurando espacios de calidad y adaptándose a los estándares y tendencias del mercado.</p>
                    </div>

                </article>

            </section>


        </>
    )
}

export default SobreNosotros;