import React, { useEffect, useState } from 'react';

import Logo from '../images/Logo.png';
import { IoMenu } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { IoIosNotifications } from "react-icons/io";
import { MdNotificationsActive } from "react-icons/md";
import axios from 'axios';

const Header = () => {
    const [menu, setMenu] = useState(false);
    const [nuevaNotificacion, setNuevaNotificacion] = useState();

    useEffect(() => {
        axios.get(`http://${import.meta.env.VITE_IP}/notificacion/listar`)
            .then(response => {
                if (response.data.length > 0) {
                    response.data.map((d) => {
                        if (d.estatus === 'Pendiente') {
                            setNuevaNotificacion(true)
                        }
                    })
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const navigate = useNavigate();
    const toNotificacion = () => {
        navigate("/notificacion");
    }

    if (menu) {
        return (
            <section className='relative flex flex-col items-center justify-center w-screen h-screen bg-primary text-secondary'>
                <IoMdCloseCircleOutline onClick={() => { setMenu(!menu) }} className='fixed right-5 top-5' size={50} />

                <nav>
                    <ul className='flex flex-col items-center justify-center gap-5'>

                        <div className='flex flex-row items-center justify-center gap-5'>
                            <FaUser />
                            <li>Miguel Vásquez</li>
                        </div>

                        <li className='cursor-pointer hover:bg-primary/50'><Link to={"/home"}>Inicio</Link></li>
                        <li className='cursor-pointer hover:bg-primary/50'><Link to={"/inventario"}>Inventarios</Link></li>
                        <li className='cursor-pointer hover:bg-primary/50'><Link to={"/administracion"}>Administración</Link></li>
                        <li className='cursor-pointer hover:bg-primary/50'><Link to={"/recuerdo"}>Imágenes de Recuerdo</Link></li>
                    </ul>
                </nav>

            </section>
        )
    }

    return (
        <section className='relative flex flex-row items-center justify-between w-screen px-5 py-1 bg-primary'>
            <picture onClick={()=>{navigate("/home")}}>
                <img src={Logo} className="w-[100px]" />
            </picture>
            <div className='flex flex-row items-center justify-center gap-5'>
                
                
                <IoMenu color='white' size={50} onClick={() => { setMenu(!menu) }} className='lg:hidden' />

                <nav>
                    <ul className='hidden lg:flex flex-row items-center justify-center gap-5 text-[#fff] text-[20px]'>

                        {/* <div className='flex flex-row items-center justify-center gap-5'>
                            
                            <li>Miguel Vásquez</li>
                        </div> */}

                        <li className='cursor-pointer hover:bg-primary/50'><Link to={"/home"}>Inicio</Link></li>
                        <li className='cursor-pointer hover:bg-primary/50'><Link to={"/inventario"}>Inventario</Link></li>
                        <li className='cursor-pointer hover:bg-primary/50'><Link to={"/administracion"}>Administración</Link></li>
                    </ul>
                </nav>
                
                <FaUser color='white' size={35} />

                {
                    nuevaNotificacion ? <MdNotificationsActive color='white' size={35} onClick={toNotificacion} /> : <IoIosNotifications color='white' size={40} onClick={toNotificacion} />
                }
                    
            </div>
        </section>
    )
}

export default Header;