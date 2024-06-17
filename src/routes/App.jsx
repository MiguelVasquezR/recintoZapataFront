import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from '../view/Home';

import Inventario from '../view/Inventario/Inventario';
import CrearInventario from '../view/Inventario/Crear';
import InformacionInventario from '../view/Inventario/Informacion';
import EditarItem from '../view/Inventario/Editar';


import Evento from '../view/Evento/Evento';
import CrearEvento from '../view/Evento/CrearEvento';
import EditarEvento from '../view/Evento/EditarEvento';

import Page from '../view/PaginaWeb/Page';
import Galeria from '../view/PaginaWeb/Galeria';
import Servicios from '../view/PaginaWeb/Servicios';
import SobreNosotros from '../view/PaginaWeb/SobreNosotros';
import Contacto from '../view/PaginaWeb/Contacto';

import Login from '../view/Login';


import Cliente from '../view/ClienteView/Cliente';
import EditarEventoC from '../view/ClienteView/EditarEvento';
import Notificacion from '../view/Notificacion';
import DocumentacionCliente from '../view/Evento/DocumentacionCliente';

import Administracion from '../view/Administracion/Administracion';
import Recuerdos from '../view/Recuerdos';

const router = createBrowserRouter([

    //pagina web
    {
        path: '/',
        element: <Page />
    },
    {
        path: '/galeria',
        element: <Galeria />
    },
    {
        path: '/servicio',
        element: <Servicios />
    },
    {
        path: '/sobre-nosotros',
        element: <SobreNosotros />
    },
    {
        path: '/contacto',
        element: <Contacto />
    },

    //Logeo
    {
        path: '/login',
        element: <Login />
    },

    //home
    {
        path: '/home',
        element: <Home />
    },
    {
        path: '/notificacion',
        element: <Notificacion />
    },

    //cliente
    {
        path: '/cliente-view',
        element: <Cliente />
    },
    {
        path: '/cliente-view/editar',
        element: <EditarEventoC />
    },


    //inventario
    {
        path: '/inventario',
        element: <Inventario />
    },
    {
        path: "/inventario/crear",
        element: <CrearInventario />
    },
    {
        path: "/inventario/editar",
        element: <EditarItem />
    }

    //eventos
    ,
    {
        path: '/evento/crear',
        element: <CrearEvento />
    },
    {
        path: '/evento/editar',
        element: <EditarEvento />
    },
    {
        path: '/documentacion-cliente',
        element: <DocumentacionCliente />
    }

    // Administración
    ,{
        path: '/administracion',
        element: <Administracion />
    },

    //Imagenes de recuerdo
    {
        path: '/recuerdo',
        element: <Recuerdos />

    }
    
]);

const App = () => {
    return <RouterProvider router={router} />
}

export default App;