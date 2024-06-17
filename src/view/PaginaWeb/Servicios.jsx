import React, { useEffect, useState } from "react"

import Logo from "../../../src/images/Logo.png"
import { useNavigate } from "react-router-dom";
import HeaderPagina from "./HeaderPagina"
import Footer from './FooterPagina'
import { Link } from 'react-router-dom';


const CardService = ({ cantidad, precio }) => {
    return (
        <div className="bg-primary w-[90%] rounded-md mx-auto my-5 flex flex-col justify-center items-center text-secondary gap-2 py-5">
            <picture>
                <img src={Logo} className="w-[130px]" />
            </picture>
            <article className="text-center flex flex-col gap-2">
                <h2 className="font-bold text-2xl">{cantidad} PERSONAS</h2>
                <h3 className="text-[20px]" >${precio}</h3>
            </article>
            <Link className="border-[1px] border-[#fff] border-solid p-2 rounded-md">Más Información</Link>
        </div>
    )
}

const Servicios = () => {
    return (
        <>
            <HeaderPagina />

            <section className="flex flex-col justify-center items-center gap-5 my-5">
                <h2 className="text-primary font-bold text-[35px]">Servicios</h2>

                <form>
                    <select name="" id="" className="border-b-[1px] border-[#000] w-[200px] p-1 outline-none text-center">
                        <option value="semana">Lunes - Viernes</option>
                        <option value="sabado">Sabado</option>
                        <option value="domingo">Domingo</option>
                    </select>
                </form>

                <CardService cantidad="100" precio="5000" />

                <div className="flex flex-col justify-center items-center gap-2" >
                    <p className="text-[20px] text-center" >Si deseas una cotización diferente contactanos</p>
                    <Link to={"/contacto"} className="border-primary border-solid border-[1px] text-primary p-2 rounded-md">Contactos</Link>
                </div>

                <article className="w-[90%]">
                    <h3 className="font-bold">Todo paquete incluye:</h3>
                    <ul className="list-disc w-[80%] mx-auto" >
                        <li>8 horas de evento a partir que empiecen a llegar invitados</li>
                        <li>Mobiliario para el número de personas estipuladas en el contrato</li>
                        <li>Hieleras</li>
                        <li>Insumo para baños:
                            <ul className="list-disc ml-5">
                                <li>Toallas interdobladas para secado de manos</li>
                                <li>Papel higiénico</li>
                                <li>Jabón antibacterial</li>
                            </ul>
                        </li>
                        <li>Mesa principal tipo vintage</li>
                        <li>Sala lounge para 10 personas</li>
                        <li>Estacionamientos para 12 vehícuos aprox.</li>
                    </ul>
                </article>
            </section>

            <Footer />
        </>
    )
}

export default Servicios;