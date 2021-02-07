import React, { useEffect, Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { logout, getUserInfo } from './redux/user/userActions';

import ResponsiveHeader from './components/Header';
import Loading from './components/Loading';


// error handling
// import ErrorBoundaryPage from './pages/error/errorBoundaryPage';
import ErrorPage from './pages/error/errorPage';
import NotFoundPage from './pages/notFound/notFoundPage';

import 'semantic-ui-css/semantic.min.css';
import './App.css'
import "./App.scss";

const HomePage = lazy(() => import('./pages/home/homePage'));

const LoginPage = lazy(() => import('./pages/login'));
const SignUpPage = lazy(() => import('./pages/signup'));
const ResetPasswordPage = lazy(() => import('./pages/resetPassword'));
const UserProfilePage = lazy(() => import('./pages/userProfile'));

const ArticlePage = lazy(() => import('./pages/article'));
const CreateEditArticlePage = lazy(() => import('./pages/createEditArticle/createEditArticlePage'));
const UserSettingsPage = lazy(() => import('./pages/userSettings/userSettingsPage'));
const ReadingListPage = lazy(() => import('./pages/readingList'));
const ContactPage = lazy(() => import('./pages/contactPage/contactPage'));

const RouteUnauthenticated = ({ isAuthenticated, ...props }) => {
  return !isAuthenticated ? <Route {...props} /> : <Redirect to="/" />;
}
const RouteAuthenticated = ({ isAuthenticated, ...props }) => {
  return isAuthenticated ? <Route {...props} /> : <Redirect to="/" />;
}

const App = ({ isAuthenticated, logout, getUserInfo, currentUser }) => {

  useEffect(() => {
    let checkSigninSocial = Cookies.get('signedInWith');
    if (checkSigninSocial && checkSigninSocial === 'social') {
      getUserInfo();
      Cookies.remove('signedInWith');
    }
  })

  return (
    // <ErrorBoundaryPage>
    <Suspense fallback={<Loading />}>
      <ResponsiveHeader
        isAuthenticated={isAuthenticated}
        logout={logout}
        currentUser={currentUser}
      >
        <Switch>
          <Route
            exact
            path="/"
            render={() => <HomePage />}
          />

          <Route
            exact
            path="/u/:username"
            render={(props) => <UserProfilePage
              isAuthenticated={isAuthenticated}
              currentUserId={(currentUser && currentUser.id) ? currentUser.id : null}
              {...props}
            />}
          />
          <Route
            exact
            path="/u/:username/a/:slug"
            render={(props) => <ArticlePage
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              {...props}
            />}
          />
          <Route
            exact
            path="/error"
            component={ErrorPage}
          />
          {/* --------Unauthenticated Routes------- */}
          <RouteUnauthenticated
            exact
            path="/login"
            component={LoginPage}
            isAuthenticated={isAuthenticated}
          />
          <RouteUnauthenticated
            exact
            path="/signup"
            component={SignUpPage}
            isAuthenticated={isAuthenticated}
          />
          <RouteUnauthenticated
            exact
            path="/users/resetPassword/:resetToken"
            isAuthenticated={isAuthenticated}
            component={ResetPasswordPage}
          />
          {/* --------Authenticated Routes------- */}
          <RouteAuthenticated
            exact
            path="/a/create"
            isAuthenticated={isAuthenticated}
            render={() => <CreateEditArticlePage currentUser={currentUser} />}
          />
          <RouteAuthenticated
            exact
            path="/a/edit/:slug"
            isAuthenticated={isAuthenticated}
            render={(props) => <CreateEditArticlePage currentUser={currentUser} {...props} />}
          />
          <RouteAuthenticated
            exact
            path="/readinglist"
            isAuthenticated={isAuthenticated}
            render={(props) => <ReadingListPage currentUser={currentUser} {...props} />}
          />
          <RouteAuthenticated
            path="/settings"
            isAuthenticated={isAuthenticated}
            render={(props) => <UserSettingsPage currentUser={currentUser} {...props} />}
          />
          <RouteAuthenticated
            exact
            path="/help"
            isAuthenticated={isAuthenticated}
            render={(props) => <ContactPage currentUser={currentUser} {...props} />}
          />
          {/* --------404------- */}
          <Route
            path="*"
            exact={true}
            component={NotFoundPage}
          />

        </Switch>

      </ResponsiveHeader>
    </Suspense>
    // </ErrorBoundaryPage>
  )
}

const mapStateToProps = state => {
  console.log('state: ', state);
  return {
    currentUser: state.userReducer.currentUser,
    isAuthenticated: state.userReducer.isAuthenticated
  }
}
const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch(logout());
  },
  getUserInfo: () => {
    dispatch(getUserInfo())
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(App);

