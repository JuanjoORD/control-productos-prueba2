import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import LoginForm from './LoginForm';
import './login.css';
import LoadMask from "Utils/LoadMask/LoadMask";

class Login extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
    };

    componentDidMount(props) {
        this.state = { prueba: true };
    }

    render() {
        const { onSubmit, loader } = this.props;
        if (localStorage.getItem('token')) {
            return (<Redirect to="/" />);
        }
        return (
            <div className="blue-gradient-bg">
                <div className="d-flex flex-column align-items-center pt-3 bienvenida">
                    <h1 className="text-center">Bienvenido al Super Market</h1>
                    <p>Página de login</p>
                </div>
                <br />
                <div className="login-wrapper">
                    <div className="card card-login col-lg-3 col-md-4 col-11">
                        <h5 className="text-center pv">INGRESAR</h5>
                        <LoadMask loading={loader} light>
                            <LoginForm onSubmit={onSubmit} />
                            <center>
                                <span>
                                    ¿No tienes cuenta?&nbsp;
                                    <Link to="/registro">Registrate aquí</Link>
                                </span>
                                {/* <br/><br/>
                                <span>
                                    ¿Has olvidado tu  contraseña?<br/>
                                    <Link to="/verify_email_user">Click para recuperarla</Link>
                                </span> */}
                                <br/><br/>
                                <span>
                                    Ver catalogo<br/>
                                    <Link to="/catalogo">Ir al catalogo</Link>
                                </span>
                            </center>
                        </LoadMask>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
