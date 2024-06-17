import React, { useEffect, useRef, useState } from 'react';

import Header from '../componets/Header';
import { MdOutlinePhotoCamera } from "react-icons/md";
import appFirebase from '../hooks/Firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const storage = getStorage(appFirebase);

const Recuerdos = () => {

    const [imageUrl, setImageUrl] = useState(null);
    const fileInputRef = useRef(null);
    const [exito, setExito] = useState();
    const navigate = useNavigate();

    useEffect(()=> {
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
        const refArchivo = ref(storage, `recuerdos/${file.name}`)
        await uploadBytes(refArchivo, file)
        const ulrImDesc = await getDownloadURL(refArchivo)
        setImageUrl(ulrImDesc)

        axios.post(`http://${import.meta.env.VITE_IP}/recuerdos/crear`, { url: ulrImDesc })
            .then((res) => {
                if (res.data === 'Recuerdo creado') {
                    setExito(true)
                }
            })
            .catch((err) => { console.log(err); })
    }

    return (
        <>
            <Header />
            {
                exito && <div className='p-3 text-center text-[#fff] text-[20px] bg-[green]'>Recuerdo creado</div>
            }

            <div className='flex flex-col items-center justify-center my-5 gap-9'>
                {imageUrl ? <img className="w-[250px] h-[200px] rounded-[4px] flex justify-center items-center object-cover" src={imageUrl} alt="Vista previa" /> : <div className="bg-[#c2c2c2] w-[250px] h-[200px] rounded-[4px] flex justify-center items-center"><MdOutlinePhotoCamera size={60} color='white' /></div>}
                <input name="image" type="file" onChange={handleUploadImage} style={{ display: 'none' }} ref={fileInputRef} />
                <button className='px-4 py-2 rounded-md bg-primary text-secondary' onClick={(e) => { e.preventDefault(); fileInputRef.current.click() }}>Seleccionar Imagen</button>
            </div>
        </>
    )
}

export default Recuerdos;