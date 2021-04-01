import { connect } from 'react-redux';
import { actions } from '../../../redux/modules/home/home';
import Home from './Home';


const ms2p = (state) => {
  return {
    ...state.home,
  };
};

const md2p = { ...actions };

export default connect(ms2p, md2p)(Home);
