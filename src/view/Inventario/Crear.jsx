import React, { useState, useRef, useEffect } from 'react';
import Header from '../../componets/Header';

import appFirebase from '../../hooks/Firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
const storage = getStorage(appFirebase);
import { useForm } from 'react-hook-form'
import { MdOutlinePhotoCamera } from "react-icons/md";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const CrearInventario = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const fileInputRef = useRef(null);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem("token")){
            axios.get(`http://${import.meta.env.VITE_IP}/validarToken?token=${localStorage.getItem("token")}`)
            .then((response)=>{
                if(response.data === "Cliente") navigate("/");
            })
            .catch((error)=>{console.log(error)})
        }
    }, [])

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        const refArchivo = ref(storage, `inventario/${file.name}`)
        await uploadBytes(refArchivo, file)
        const ulrImDesc = await getDownloadURL(refArchivo)
        setImageUrl(ulrImDesc)
    }

    const guardarData = (data) => {

        const enviarDatos = {
            nombre: data.nombre,
            totalCantidad: data.cantidad,
            cantidadActual: data.cantidad,
            tipo: data.tipo,
            precioUnitario: data.precio,
            linkFoto: imageUrl
        }

        axios.post(`http://${import.meta.env.VITE_IP}/inventario/crear`, enviarDatos)
            .then((res) => {
                console.log(res);
                navigate("/inventario")
            })
            .catch((err) => { console.log(err); })

    }

    return (
        <>
            <Header />

            <section className='flex flex-col items-center justify-center'>

                <h2 className='p-4 text-2xl font-bold'>Crear Ítem</h2>
                <form onSubmit={handleSubmit(guardarData)} className="flex flex-col justify-center items-center gap-5 w-[80%]">

                    <div className='flex flex-col items-center justify-center gap-3'>
                        {imageUrl ? <img className="w-[150px] h-[150px] rounded-[50%] flex justify-center items-center" src={imageUrl} alt="Vista previa" /> : <div className="bg-[#c2c2c2] w-[150px] h-[150px] rounded-[50%] flex justify-center items-center"><MdOutlinePhotoCamera size={60} color='white' /></div>}
                        <input name="image" type="file" onChange={handleUploadImage} style={{ display: 'none' }} ref={fileInputRef} />
                        <button className='px-4 py-2 rounded-md bg-primary text-secondary' onClick={(e) => { e.preventDefault(); fileInputRef.current.click() }}>Seleccionar Imagen</button>
                    </div>

                    <input {...register("nombre", { required: true })} className='outline-none w-[100%] border-b-[1px] border-[#c3c2c3] border-solid p-1' type="text" placeholder='Nombre del Ítem' />
                    <input {...register("cantidad", { required: true })} className='outline-none w-[100%] border-b-[1px] border-[#c3c2c3] border-solid p-1' type="text" placeholder='Cantidad Total' />
                    <input {...register("tipo", { required: true })} className='outline-none w-[100%] border-b-[1px] border-[#c3c2c3] border-solid p-1' type="text" placeholder='Tipo' />
                    <input {...register("precio", { required: true })} className='outline-none w-[100%] border-b-[1px] border-[#c3c2c3] border-solid p-1' type="text" placeholder='Precio Unitario' />
                    <button type='submit' className='px-4 py-2 rounded-md bg-primary text-secondary'>Guardar</button>
                </form>

            </section>


        </>
    );
}

export default CrearInventario;