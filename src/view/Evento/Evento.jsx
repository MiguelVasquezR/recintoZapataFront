import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../componets/Header';

const Evento = () => {

    const navigate = useNavigate();


    return (
        <>
            <Header />

            <section className='flex flex-col'>

                <h2>Eventos</h2>

                <a className= 'bg-primary text-secondary px-2 py-4 rounded-md inline' onClick={(e) => { e.preventDefault(); navigate("/evento/crear"); }}>Crear Evento</a>

                <h3>Tabla de Eventos</h3>
                

            </section>

        </>
    );
}

export default Evento;