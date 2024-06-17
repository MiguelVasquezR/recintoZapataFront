import React, { useEffect, useState } from 'react';
import Header from '../../componets/Header';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";


const Inventario = () => {
    const [items, setItems] = useState([]);
    const [filtro, setFiltro] = useState('');
    const navigate = useNavigate();
    const [alert, setAlert] = useState();

    const handleSearch = (e) => {
        e.preventDefault();
        const filtro = e.target.value;
        setFiltro(filtro);
    };

    const itemFiltrado = items.filter((item) => {
        return item.nombre.toLowerCase().includes(filtro.toLowerCase());
    });

    useEffect(() => {
        axios.get(`http://${import.meta.env.VITE_IP}/inventario/items`)
            .then((res) => {
                setItems(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const eliminarItem = (item) => {
        axios.delete(`http://${import.meta.env.VITE_IP}/inventario/eliminar?id=${item.id}`)
            .then((res) => {
                if (res.data === 'Se elimino correctamente') {
                    const newItems = items.filter((i) => {
                        return i.id !== item.id;
                    });
                    setItems(newItems);
                    setAlert('Se ha eliminado el item');
                    setTimeout(() => {
                        setAlert('');
                    }, 1500)
                } else {
                    setAlert('No se ha podido eliminar el item');
                }

            })
            .catch((err) => {
                console.log(err);
            })
    }

    const editarItem = (item) => {
        navigate(`/inventario/editar?id=${item.id}`)
    }

    return (
        <>
            <Header />
            <section className='flex flex-col gap-5 px-4 py-2 lg:w-[90%] lg:mx-auto'>
                <h2 className='text-2xl font-bold'>Inventario</h2>
                <div className='flex flex-col gap-4'>
                    <Link to='/inventario/crear' className='bg-primary w-[150px] text-center rounded-md px-4 py-2 text-secondary'>Crear ítem</Link>
                    <form className='flex gap-5'>
                        <input
                            value={filtro}
                            onChange={handleSearch}
                            type='text'
                            placeholder='Ingresa nombre de ítem'
                            className='p-1 border-b-[1px] border-[#000] border-solid outline-none lg:w-[500px]'
                        />
                        <button onClick={handleSearch} className='px-4 py-2 rounded-md bg-primary text-secondary'>Buscar</button>
                    </form>
                </div>
                <section className=' w-[100%]'>
                    <h3 className='text-xl font-bold'>Lista de Inventario</h3>

                    {
                        alert ? <p className='bg-primary/95 text-secondary p-1 rounded-md text-center text-[16px]'>{alert}</p> : ""
                    }

                    <div className='w-[100%] grid grid-cols-1 lg:grid-cols-2 my-5 gap-5'>
                        {
                            itemFiltrado.map((item, index) => { // Mostrar todos los elementos
                                return (
                                    <div key={index} className='flex flex-row items-center gap-5 my-3 rounded-md shadow-md justify-evenly bg-primary]'>
                                        <picture>
                                            <img src={item.linkFoto} alt={item.nombre} className='h-[120px] w-[120px] rounded-md' />
                                        </picture>
                                        <article className='my-3'>
                                            <h2>Nombre: {item.nombre}</h2>
                                            <h2>Tipo: {item.tipo}</h2>
                                            <h2>Cantidad total: {item.totalCantidad}</h2>
                                            <h2>Cantidad actual: {item.cantidadActual}</h2>
                                            <h2>Precio Unitario: {item.precioUnitario}</h2>
                                        </article>
                                        <div className='flex flex-col items-center justify-center gap-5'>
                                            <MdDelete onClick={() => { eliminarItem(item) }} size={30} className='cursor-pointer text-primary/80' />
                                            <MdEdit onClick={() => editarItem(item)} size={30} className='cursor-pointer text-primary/80' />
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </section>
            </section>
        </>
    );
};

export default Inventario;
