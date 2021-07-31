import React from 'react'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Container } from '@material-ui/core'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { TextField } from 'formik-material-ui'
import { connect } from 'react-redux'
import { login, clearError } from './userSlice'
import ErrorSnackbar from '../../ui/ErrorSnackbar'
import landingBG from './landingBG.svg'
import lumslogo from './LUMSLogo.png'
import cmsLogo from './cmswhite.png'
// card styling
const useStyles = makeStyles(theme=>({
  root: {
    position: 'absolute',
    maxWidth: '32vw',
    marginLeft: 0,
    marginTop: 0,
    height: '100%',
    backgroundColor: "#3578fa",
    color: theme.palette.secondary.main
  },
  input: {
    color: 'black',
  }
}))

/**
  The LoginPage constitutes a toggle button to switch between a CCA or Society
  Login and fields to enter the user email and password. 
 */

function LoginPage({error, dispatch, match, location}) {
  const classes = useStyles()
  const selectedBGStyle = {backgroundColor: "cornflowerblue", color:"white", borderColor: "#F5FFFA"}
  const normalBGStyle = {backgroundColor: "#2555b5", color:"white"}
  const [userType, setUserType] = React.useState("CCA")

  // React.useEffect(() => {
  //   // dispatch(login({email: "lumun@lums.edu.pk", password: "Test12345", userType: "Society"}))
  //   dispatch(login({email: "admin@lums.edu.pk", password: "Test12345", userType: "CCA"}))
  // }, [])

  return (
    <Container component="main" className={classes.root}>
      <img style={{position: 'absolute', left: '30vw', width: '70vw', height: '100vh'}}
      src={landingBG} alt="CMS"/>
      <img style={{
        left: '3vw',
        width: '12vw',
        height: '9vh',
      }}
      src={lumslogo} alt="lumslogo"/>
    
      <div style={{marginTop: '20vh', marginLeft: '3vw'}}>
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues = {{
            email: '',
            password: '',
        }}
        validationSchema={Yup.object({
            email: Yup.string()
              .email('Invalid Email Address')
              .required('Required'),
            password: Yup.string()
              .required('Required')
        })}
        onSubmit={ (values, { setSubmitting }) => {
            dispatch(login({email: values.email, password: values.password, userType: userType}))
            .then(() => {
              setSubmitting(false)
            }) 
          }
        }
      >
        {({submitForm, isSubmitting})=>(
          <Form>
            <h1 style={{color: "white"}}>Login</h1>

            <ToggleButtonGroup size="medium" value={userType} exclusive>
              <ToggleButton
              value="CCA" 
              onClick={()=>setUserType("CCA")} 
              style={userType==="CCA" ? selectedBGStyle : normalBGStyle}>
                CCA
              </ToggleButton>,
              <ToggleButton 
              value="Society" 
              onClick={()=>setUserType("Society")}
              style={userType==="Society" ? selectedBGStyle : normalBGStyle}>
                Society
              </ToggleButton>
              <ToggleButton 
              value="General" 
              onClick={()=>setUserType("General")}
              style={userType==="General" ? selectedBGStyle : normalBGStyle}>
                General
              </ToggleButton>
            </ToggleButtonGroup>
            <br/>            

            <Field
              style = {{backgroundColor: 'white'}}
              component={TextField}
              variant="filled"
              margin="normal"
              required
              label="Email"
              name="email"
              InputProps={{
                className: classes.input,
              }}
            ></Field>
            <br/>            
            <Field
              style = {{backgroundColor: 'white'}}
              component={TextField}
              variant="filled"
              margin="normal"
              required
              label="Password"
              name="password"
              type="password"
              InputProps={{
                className: classes.input,
              }}
            > 
            </Field>
            
            <br/>    
            <br/>
            <Button size="large" onClick={submitForm} type="submit"
            variant="contained" color="secondary" spacing= '10'
            endIcon={<NavigateNextIcon/>}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
        
      </div>
      
      <ErrorSnackbar stateError={error} clearError={clearError}/>
    </Container>
  )
}

const mapStateToProps = (state) => ({
  error: state.user.error,
})

export default connect(mapStateToProps) (LoginPage)