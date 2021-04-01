import { connect } from 'react-redux';
import { actions } from '../../../redux/modules/catalogo/catalogo';
import Catalogo from './Catalogo';


const ms2p = (state) => {
  return {
    ...state.catalogo,
  };
};

const md2p = { ...actions };

export default connect(ms2p, md2p)(Catalogo);
