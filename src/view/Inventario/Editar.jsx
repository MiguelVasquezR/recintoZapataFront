import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Header from '../../componets/Header';
import axios from 'axios';

const EditarItem = () => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const { register, handleSubmit, setValue } = useForm();
    const navigate = useNavigate();

    const [item, setItem] = useState({});
    const [nombre, setNombre] = useState('');
    const [cantidadTotal, setCantidadTotal] = useState('');
    const [tipo, setTipo] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');

    useEffect(() => {
        if(localStorage.getItem("token")){
            axios.get(`http://${import.meta.env.VITE_IP}/validarToken?token=${localStorage.getItem("token")}`)
            .then((response)=>{
                if(response.data === "Cliente") navigate("/");
            })
            .catch((error)=>{console.log(error)})
        }
        axios.get(`http://${import.meta.env.VITE_IP}/inventario/item?id=${idParam}`)
            .then((res) => {
                setItem(res.data);
                setNombre(res.data.nombre);
                setCantidadTotal(res.data.totalCantidad);
                setTipo(res.data.tipo);
                setPrecioUnitario(res.data.precioUnitario);
            })
            .catch((err) => { console.log(err); });
    }, [idParam]);

    const guardarData = (data) => {
        const enviarDatos = {
            id: item.id,
            nombre: nombre,
            totalCantidad: cantidadTotal,
            tipo: tipo,
            precioUnitario: precioUnitario,
        };

        axios.put(`http://${import.meta.env.VITE_IP}/inventario/actualizar`, enviarDatos)
        .then((res)=>{
            if(res.data === "Se actualizo correctamente"){
                navigate("/inventario")
            }
        })
        .catch((err)=>{
            console.log(err);
        })

    };

    return (
        <>
            <Header />
            <h2 className='my-5 text-2xl font-bold text-center'>Editar Ítem</h2>

            <form onSubmit={handleSubmit(guardarData)} className="flex flex-col justify-center items-center gap-5 w-[80%] mx-auto my-5">
                <picture>
                    <img src={item.linkFoto} className='object-cover w-[120px] h-[150px] rounded-md' alt="Foto del item" />
                </picture>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} className='outline-none w-[100%] border-b-[1px] border-[#c3c2c3] border-solid p-1' type="text" placeholder='Nombre del Ítem' />
                <input value={cantidadTotal} onChange={(e) => setCantidadTotal(e.target.value)} className='outline-none w-[100%] border-b-[1px] border-[#c3c2c3] border-solid p-1' type="text" placeholder='Cantidad Total' />
                <input value={tipo} onChange={(e) => setTipo(e.target.value)} className='outline-none w-[100%] border-b-[1px] border-[#c3c2c3] border-solid p-1' type="text" placeholder='Tipo' />
                <input value={precioUnitario} onChange={(e) => setPrecioUnitario(e.target.value)} className='outline-none w-[100%] border-b-[1px] border-[#c3c2c3] border-solid p-1' type="text" placeholder='Precio Unitario' />
                <button type='submit' className='px-4 py-2 rounded-md bg-primary text-secondary'>Guardar</button>
            </form>
        </>
    );
}

export default EditarItem;
