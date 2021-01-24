import { connect } from 'react-redux';

import ArticlePage from './articlePage';

// const mapStateToProps = state => {
//    return {
//       isFetching: state.userReducer.isFetching,
//       message: state.userReducer.message
//    }
// }
// const mapDispatchToProps = dispatch => ({
//    login: (email, password) => {
//       dispatch(login(email, password));
//    },
//    forgotPassword: (email) => {
//       dispatch(forgotPassword(email))
//    }

// })

export default connect(null)(ArticlePage);