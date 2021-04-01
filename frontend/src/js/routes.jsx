import React from 'react';
import {
    Route,
    Switch,
    Redirect,
} from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';

import {Login, Profile, Registro} from './common/components/LoginRegister';
import Demo from './common/components/Demo/Demo';
import ProtectedRoute from './ProtectedRoute';
import Examples from './common/components/Examples/Basic';
import NotFound from './common/components/layout/NotFound/NotFound';

import ProductoCreateContainer from './common/components/Producto/ProductoCreateContainer'
import ProductoListContainer from './common/components/Producto/ProductoListContainer'
import LoteCreateContainer from './common/components/Lote/LoteCreateContainer'
import LoteListContainer from './common/components/Lote/LoteListContainer'
import CatalogoContainer from './common/components/Catalogo/CatalogoContainer'
import HomeContainer from './common/components/Home/HomeContainer'

import '../assets/fonts/fonts.css';

require('../../node_modules/font-awesome/css/font-awesome.css');
require('../../node_modules/bootstrap/dist/css/bootstrap.css');
import 'bootstrap/dist/css/bootstrap.min.css';
import Grids from "./common/components/Examples/Grids";
import Notificaciones from './common/components/Examples/Notificaciones';
import ExampleTabs from './common/components/Examples/Tabs/Tabs';
require('../style/index.css');

module.exports = (
    <div>
        <div className="container__content">
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/registro" component={Registro} />                
                <Route exact path="/catalogo" component={CatalogoContainer} />

                <ProtectedRoute exact path="/catalogo-user" component={CatalogoContainer} />
                <ProtectedRoute exact path="/" component={HomeContainer} />
                <ProtectedRoute exact path="/page2" component={Examples} />
                <ProtectedRoute exact path="/user-profile" component={Profile} />
                <ProtectedRoute exact path="/grids" component={Grids} />
                <ProtectedRoute exact path="/notifications" component={Notificaciones} />
                <ProtectedRoute exact path="/home" component={ExampleTabs} />

                <ProtectedRoute exact path="/producto/register" component={ProductoCreateContainer} />
                <ProtectedRoute exact path="/producto/:id/editar" component={ProductoCreateContainer} />
                <ProtectedRoute exact path="/producto/:id" component={ProductoCreateContainer} />
                <ProtectedRoute exact path="/producto" component={ProductoListContainer} />

                <ProtectedRoute exact path="/producto/:id/lotes" component={LoteListContainer} />
                <ProtectedRoute exact path="/producto/:id/lotes/register" component={LoteCreateContainer} />
                <ProtectedRoute exact path="/producto/:id/lotes/:idLote/editar" component={LoteCreateContainer} />
                <ProtectedRoute exact path="/producto/:id/lotes/:idLote" component={LoteCreateContainer} />
                

                <Route component={NotFound} />
            </Switch>
        </div>
        <NotificationContainer />
    </div>
);
