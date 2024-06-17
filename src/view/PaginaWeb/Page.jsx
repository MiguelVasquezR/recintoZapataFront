import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./FooterPagina";
import HeaderPagina from "./HeaderPagina";
import FondoInicio from "../../../src/images/FondoInicio.jpg";
import FondoInicioMD from "../../../src/images/FondoInicioMD.jpg";
import Servicios from "../../../src/images/Servicios.jpeg";
import Galeria from "../../../src/images/Galeria.jpg";
import Video from "../../../src/images/video.mp4";

import RZInicio from "../../../src/images/RZInicio.jpeg";
import axios from "axios";

const Page = () => {
    const navigate = useNavigate();
    const [option, setOption] = useState(true);
    const [text, setText] = useState("Ver Video");
    const [urlsImages, setUrlsImages] = useState([]);

    useEffect(() => {
        setText(option ? "Ver Video" : "Ver Mapa");
    }, [option]);

    useEffect(() => {
        axios.get(`http://${import.meta.env.VITE_IP}/recuerdos/listar`)
            .then((res) => { setUrlsImages(res.data); })
            .catch((err) => { console.log(err); })
    }, [])

    const toServices = () => {
        navigate("/servicio");
    };

    const settings = {
        infinite: true,
        autoplay: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
    };

    return (
        <>
            <HeaderPagina />
            <section className="flex flex-col items-center justify-center gap-5">

                <div className="relative text-secondary">
                    <picture>
                        <img src={RZInicio} alt="FondoInicio" className="object-cover w-screen h-screen" />
                    </picture>
                    <div className="absolute inset-0 flex items-center justify-center text-white bg-primary bg-opacity-20">
                        <h2 className="text-4xl font-bold text-center">
                            Creamos recuerdos inolvidables
                        </h2>
                    </div>
                </div>

                {/* servicios */}
                <div onClick={toServices} className="relative text-secondary w-[90%] rounded-md xl:w-[50%]">
                    <picture>
                        <img src={Servicios} alt="Servicios" className="h-[200px] w-full object-cover rounded-md" />
                    </picture>
                    <div className="absolute inset-0 flex items-center justify-center text-white rounded-md bg-primary bg-opacity-40">
                        <h2 className="text-4xl font-bold text-center">Servicios</h2>
                    </div>
                </div>


                <div className="text-secondary w-[90%] rounded-md xl:w-[50%]">

                    {
                        urlsImages.length === 0 ?
                            ""
                            :
                            <>
                                <h2 className="text-primary font-bold text-[30px] text-center my-5">
                                    Galería
                                </h2>
                                <Slider {...settings} className="w-[100%] h-[250px] mx-auto">
                                    {urlsImages.map((url, index) => (
                                        <div key={index}>
                                            <img
                                                src={url.url}
                                                alt={`Image ${index}`}
                                                className="w-[100%] h-[250px] object-cover"
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </>

                    }

                </div>



                <section className="flex flex-col items-center justify-center gap-5">
                    <h2 className="text-[30px] font-bold mx-5 text-primary">Ubicación</h2>
                    {option ? (
                        <iframe
                            title="Ubicación"
                            className="w-[100%] rounded-md"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2988.0478318649693!2d-96.9176531484884!3d19.510980185942113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85db3375323ffd3d%3A0xfb6c88e015875b71!2sRecinto%20Zapata!5e0!3m2!1ses-419!2smx!4v1713833901901!5m2!1ses-419!2smx"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    ) : (
                        <video
                            className="w-[90%] h-[400px] rounded-md"
                            src={Video}
                            autoPlay
                            controls
                        ></video>
                    )}
                    <button
                        onClick={() => setOption(!option)}
                        className="cursor-pointer text-secondary bg-primary py-2 px-4 w-[200px] rounded-md"
                    >
                        {text}
                    </button>
                </section>

                <Footer />
            </section>
        </>
    );
};

export default Page;
