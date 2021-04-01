import { connect } from 'react-redux';
import { actions } from '../../../redux/modules/lote/lote';
import LoteList from './LoteList';


const ms2p = (state) => {
  return {
    ...state.lote,
  };
};

const md2p = { ...actions };

export default connect(ms2p, md2p)(LoteList);
