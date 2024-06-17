import React, {useEffect, useState } from "react"
import Logo from "../../../src/images/Logo.png"
import { IoMenu } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';
import axios from "axios";

const HeaderPagina = () => {
    const [menu, setMenu] = useState(false);
    const [isToken, setIsToken] = useState(false);
    const [tipo, setTipo] = useState("")

    useEffect(()=>{
        if(localStorage.getItem("token")){
            setIsToken(true)
            axios.get(`http://${import.meta.env.VITE_IP}/validarToken?token=${localStorage.getItem("token")}`)
            .then((response)=>{
                response.data === "Cliente" ? setTipo("cliente-view") : setTipo("home")
            })
            .catch((error)=>{console.log(error);})
        }
    }, [])

    if (menu) {
        return (
            <section className='relative flex flex-col items-center justify-center w-screen h-screen bg-primary text-secondary'>
                <IoIosCloseCircleOutline onClick={() => { setMenu(!menu) }} className='fixed right-5 top-5' size={50} />

                <nav>
                    <ul className='flex flex-col items-center justify-center gap-5'>
                        { !isToken ? <li><Link to={"/login"}>Iniciar Sesión</Link></li> : <li><Link to={`/${tipo}`}>Sesión Iniciada</Link></li> } 
                        <hr className="h-[1px] w-[100px] bg-secondary" />
                        <li><Link to={"/"}>Inicio</Link></li>
                        <li><Link to={"/sobre-nosotros"}>Nosotros</Link></li>
                        <li><Link to={"/contacto"}>Contacto</Link></li>
                    </ul>
                </nav>

            </section>
        )
    }

    return (
        <section className="flex flex-row items-center justify-between w-full px-3 bg-primary text-secondary">
            <picture><img src={Logo} className="w-[100px]" /></picture>
            <IoMenu size={50} onClick={() => { setMenu(!menu) }} className="xl:hidden" />

            <nav className="hidden xl:flex xl:text-[20px]">
                <ul className="flex flex-row gap-5">
                    <li><Link to={"/"}>Inicio</Link></li>
                    <li><Link to={"/sobre-nosotros"}>Nosotros</Link></li>
                    <li><Link to={"/contacto"}>Contacto</Link></li>
                    { !isToken ? <li><Link to={"/login"}>Iniciar Sesión</Link></li> : <li><Link to={`/${tipo}`}>Sesión Iniciada</Link></li> } 
                </ul>
            </nav>
        </section>
    )
}

export default HeaderPagina;