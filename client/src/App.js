import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import 'typeface-montserrat'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import NavBar from './ui/NavBar'
import RequestList from './features/request-management/RequestList'
import LoginPage from './features/account-settings/LoginPage'
import CCASettingsHome from './features/account-settings/CCASettingsHome'
import SponsorForm from './features/form-management/SponsorForm'
import CCAAccountsPanel from './features/account-settings/CCAAccountsPanel'
import SocietyAccountsPanel from './features/account-settings/SocietyAccountsPanel'
import DUserAccountsPanel from './features/account-settings/DUserAccountsPanel'
import DepartmentPanel from './features/account-settings/DepartmentPanel'
import CategoryPanel from './features/account-settings/CategoryPanel'
import MileagePanel from './features/account-settings/MileagePanel'
import ChangePassword from './features/account-settings/ChangePassword'
import SocietyDashboard from './ui/SocietyDashboard'
import { connect } from 'react-redux'

function App({ user }) {
  const { id, isLoggedIn, userType, name, themeColor, darkMode } = user
  
  document.body.style = darkMode ? 'background: #424242' : 'background: #ffffff' 

  const appTheme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#01bc8d',
      },
      secondary: {
        main: '#ffffff',
      },
      text: {
        secondary: darkMode ? '#ffffff': '#6f7eaa'
      },
      shade: darkMode ? '#363636' : '#f4f4f4'
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'Montserrat',
      ].join(','),
      fontSize: 12,
    },
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          fontSize: 13
        }
      }
    }
  })


  return (
    <Router>
      <ThemeProvider theme={appTheme}>
        <div>
          { 
            isLoggedIn &&
            <NavBar name={name} userType={userType} />
          }
          <Switch>
            <Route path="/" exact component={isLoggedIn ? (userType === "CCA" ? RequestList : SocietyDashboard) : LoginPage}/>
            <Route path="/sponsor-mou" exact component={isLoggedIn ? SponsorForm : LoginPage}/>
            <Route path="/sponsor-mou/:mode/:id" component={isLoggedIn ? SponsorForm : LoginPage}/>
            <Route path="/change-password" exact component={isLoggedIn ? ChangePassword : LoginPage}/>
            <Route path="/settings" exact component={isLoggedIn ? CCASettingsHome : LoginPage}/>
            <Route path="/request-list" exact component={isLoggedIn ? RequestList : LoginPage}/>
            <Route path="/cca-panel" exact component={isLoggedIn ? CCAAccountsPanel : LoginPage}/>
            <Route path="/society-panel" exact component={isLoggedIn ? SocietyAccountsPanel : LoginPage}/>
            <Route path="/department-panel" exact component={isLoggedIn ? DepartmentPanel : LoginPage}/>
            <Route path="/category-panel" exact component={isLoggedIn ? CategoryPanel : LoginPage}/>
            <Route path="/mileage-panel" exact component={isLoggedIn ? MileagePanel : LoginPage}/>
            <Route path="/duser-panel" exact component={isLoggedIn ? DUserAccountsPanel : LoginPage}/>
          </Switch>
        </div>

      </ThemeProvider>
    </Router>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps) (App)