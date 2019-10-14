import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router';
import styled from 'styled-components';
import firebase from './firebase/FirebaseConfig';
import { Layout, Icon } from 'antd';
import { useStateValue } from './hooks/useStateValue';
import {
  subscribeToUserOrganizations,
  signedIn,
  signedOut,
  subscribeToMessages,
} from './actions';
import { HeaderDiv, FooterDiv, AffixSider, MenuButton } from './components';
import {
  MainDashboard,
  OrganizationDashboard,
  Signup,
  CreateEvent,
  CreateOrg,
  Login,
  LandingPage,
  NotFound,
  UserProfile,
  OrganizationProfile,
  EventProfile,
} from './views';

import {
  RegisteredAndLoggedInRoute,
  LoginRoute,
  OrganizationRoute,
  ProtectedRoute,
  RegisterRoute,
} from './routes/index';
import Message from './views/Message';
import { device } from './styled/deviceBreakpoints';

const { Content } = Layout;

function App() {
  const [state, dispatch] = useStateValue();
  const [collapsed, setCollapsed] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: document.body.clientHeight,
  });
  const [subscriptions, setSubscriptions] = useState({});

  /**
   * Set up google auth on change event handler.
   */
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        signedIn(user, dispatch);
      } else {
        signedOut(dispatch);
      }
    });
  }, []);
  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
  }, []);

  useEffect(() => {
    if (state.auth.googleAuthUser && state.auth.googleAuthUser.uid) {
      const orgSub = subscribeToUserOrganizations(
        state.auth.googleAuthUser.uid,
        dispatch
      );
      const messageSub = subscribeToMessages(
        { type: 'users', uid: state.auth.googleAuthUser.uid },
        dispatch
      );
      setSubscriptions({ orgSub, [state.auth.googleAuthUser.uid]: messageSub });
    }
  }, [state.auth.googleAuthUser]);

  useEffect(() => {
    state.org.userOrganizations.forEach(org => {
      if (!subscriptions[org.orgId]) {
        const messageSub = subscribeToMessages(
          {
            type: 'organizations',
            uid: org.orgId,
          },
          dispatch
        );
        setSubscriptions({ ...subscriptions, [org.orgId]: messageSub });
      }
    });
  }, [state.org.userOrganizations]);

  const updateDimensions = () => {
    setDimensions({
      width: window.innerWidth,
      height: document.body.scrollHeight,
    });
    if (window.innerWidth < 900) {
      setCollapsed(true);
    }
  };

  return (
    <StyledApp className="App">
      <Layout style={{ background: '#fafafa' }}>
        {state.auth.loggedIn && state.auth.signedUp && (
          <AffixSider collapsed={collapsed} />
        )}
        <Layout style={{ background: '#fafafa' }}>
          <HeaderDiv loggedIn={state.auth.loggedIn}>
            {state.auth.loggedIn && state.auth.signedUp && (
              <MenuButton collapsed={collapsed} setCollapsed={setCollapsed} />
            )}
          </HeaderDiv>
          <Route
            exact
            path={'/'}
            render={props => <LandingPage {...props} collapsed={collapsed} />}
          />
          <StyledContent
            width={dimensions.width}
            loggedIn={state.auth.loggedIn}
          >
            <Switch>
              <LoginRoute path={'/login'} component={Login} />
              <LoginRoute path={'/signup'} component={Login} />

              <ProtectedRoute
                path={'/organization/:id'}
                component={OrganizationProfile}
              />
              <ProtectedRoute path={'/dashboard'} component={MainDashboard} />
              <RegisteredAndLoggedInRoute
                path={'/create-org'}
                component={CreateOrg}
              />
              <OrganizationRoute
                path={'/org-dashboard/create-event'}
                component={CreateEvent}
              />
              <OrganizationRoute
                path={'/org-dashboard'}
                component={OrganizationDashboard}
              />
              <RegisterRoute path={'/register'} component={Signup} />
              <RegisteredAndLoggedInRoute
                path={'/messages'}
                component={Message}
                width={dimensions.width}
              />

              <ProtectedRoute path={'/events/:id'} component={EventProfile} />

              <RegisteredAndLoggedInRoute
                path={`/profile/:id`}
                component={UserProfile}
              />
              <Route path="/:anything" component={NotFound} />
            </Switch>
          </StyledContent>
          <FooterDiv />
        </Layout>
      </Layout>
    </StyledApp>
  );
}

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  margin-top: 64px;
`;

const StyledContent = styled(Content)`
  && {
    padding-bottom: ${props => props.theme.footerPadding};
    background: ${({ theme }) => theme.gray2};
    max-width: ${({ theme }) => theme.maxWidth};
    margin: 15px auto 45px;
    display: flex;
    flex-direction: column;

    @media (min-width: 1088px) {
      min-width: 750px;
    }
    @media ${device.laptop} {
      max-width: 90%;
    }
  }
`;

export default App;
