import React, { useState, useEffect }from 'react'
import { Button, Card, CardHeader, CardContent, Grid, Typography, FormControl, InputLabel, MenuItem, Switch, FormControlLabel, FormGroup,
  Avatar, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, LinearProgress, Container} from '@material-ui/core'
import {connect} from 'react-redux'
import MoreButton from '../../ui/MoreButton'
import ToggleOffIcon from '@material-ui/icons/ToggleOff'
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import EditIcon from '@material-ui/icons/Edit'
import { Formik, Form, Field } from 'formik'
import { TextField, Select } from 'formik-material-ui'
import * as Yup from 'yup'
import ErrorSnackbar from "../../ui/ErrorSnackbar"
import PanelBar from './PanelBar'
import AccessibilityIcon from '@material-ui/icons/Accessibility'
import { addCCAAccount, toggleActiveCCAAccount, editCCAAccount, fetchCCAAccounts, clearError, editCCAPermissions } from './ccaDetailsSlice'


function CCAAccountPanel({ccaDetails,dispatch}) {

  useEffect(() => {
    dispatch(fetchCCAAccounts())
  }, [])
  
  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(-1)
  const [permissionMode, setPermissionsMode] = useState(false)
  const [permissions, setPermissions] = useState({})
  

  function handlePermissionsChange(event) {
    setPermissions({ 
      ...permissions, 
      [event.target.name]: event.target.checked 
    })
  }

  function handleDispatchPermissionsChange() {
    dispatch(editCCAPermissions({ccaId: editId, permissions: permissions}))
  }

  function handlePermissions(ccaId) {
    setEditId(ccaId)
    setPermissionsMode(true)
    const ccaMember = ccaDetails.ccaList.find((member,index) => {
      return member.ccaId === ccaId
    })
    if(ccaMember !== undefined){
      setPermissions(ccaMember.permissions)
    }
  }

  function handleClosePermission() {
    setPermissionsMode(false)
  }

  function handleClose(){
    setIsOpen(false)
  }

  function EditDeleteMoreButton({ccaId, active}){
    const menusList=[
      {
        text: 'Edit',
        icon: <EditIcon/>,
        onClick: ()=>handleEdit(ccaId)
      },
      {
        text: active ? 'Deactivate' : 'Activate',
        icon: active ? <ToggleOffIcon/> : <ToggleOnIcon/>,  
        onClick: ()=>dispatch(toggleActiveCCAAccount({ccaId, active}))
      },
      {
        text: 'Manage Permissions',
        icon: <AccessibilityIcon/>,
        onClick: () => handlePermissions(ccaId)
      }
    ]
    return <MoreButton menusList={menusList}/>
  }

  function handleAdd(){
    setEditMode(false)
    setIsOpen(true)
  }
  
  function handleEdit(ccaId){
    setEditId(ccaId)
    setEditMode(true)
    setIsOpen(true)
  }

  function PermissionsDialog(){
    return (
    <Dialog 
      open={permissionMode}
      onClose={handleClosePermission}
    >
      <DialogTitle style={{ cursor: 'move' }} >
        Manage User Permissions
      </DialogTitle>
      <FormControl component="fieldset" style={{marginLeft: "10%", marginBottom: 20}}>
        <FormGroup>
          <FormControlLabel
            control={<Switch color="primary" size="small" checked={permissions.accountAccess} onChange={handlePermissionsChange} name="accountAccess"/>}
            label="Account Access"
            style={{marginBottom: 8}}
          />
          <FormControlLabel
            control={<Switch color="primary" size="small" checked={permissions.approvalAccess} onChange={handlePermissionsChange} name="approvalAccess"/>}
            label="Approval Access"
            style={{marginBottom: 8}}
          />
          <FormControlLabel
            control={<Switch color="primary" size="small" checked={permissions.reviewAccess} onChange={handlePermissionsChange} name="reviewAccess"/>}
            label="Review Access"
            style={{marginBottom: 8}}
          />
          <FormControlLabel
            control={<Switch color="primary" size="small" checked={permissions.cancelAccess} onChange={handlePermissionsChange} name="cancelAccess"/>}
            label="Cancel Access"
            style={{marginBottom: 8}}
          />
          <FormControlLabel
            control={<Switch color="primary" size="small" checked={permissions.logAccess} onChange={handlePermissionsChange} name="logAccess"/>}
            label="View Logs of MoU"
            style={{marginBottom: 8}}
          />
          <FormControlLabel
            control={<Switch color="primary" size="small" checked={permissions.categoryAccess} onChange={handlePermissionsChange} name="categoryAccess"/>}
            label="Categories & Mileage Access"
            style={{marginBottom: 8}}
          />
        </FormGroup>
      </FormControl>
        <Button onClick={handleDispatchPermissionsChange} color="primary">
          Change Permissions
        </Button>
        <br/>
    </Dialog>
    )
  }

  function CCADialog(){
    let initialValues = {
      name: '',
      designation: '',
      email: '',
      password: '',
      passwordRequired: !editMode,
      role:'',
      permissions: {
        accountAccess: true,
        approvalAccess: true,
        reviewAccess: true,
        verifyAccess: true,
        cancelAccess: true,
        logAccess: true,
        categoryAccess: true
      }
    }

    if(editMode){
      const ccaMember = ccaDetails.ccaList.find((member,index) => {
        return member.ccaId === editId
      })
      if(ccaMember !== undefined){
        initialValues = {
          ...ccaMember,
          passwordRequired: !editMode,

        }
      }
    }

    return(
      <Dialog 
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >

      <DialogTitle style={{ cursor: 'move' }} ccaId="draggable-dialog-title">
        {editMode ? "Edit Account" : "Add Account"}
      </DialogTitle>
      
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues = {initialValues}
        validationSchema={Yup.object({
          passwordRequired: Yup.boolean(),
          email: Yup.string()
            .email('Invalid Email Address')
            .required('Required'),
          password: Yup.string()
          .min(8,'Must be at least 8 characters')
          .max(30,'Must be atmost 30 characters')
          .matches('^[a-zA-Z0-9]+$', 'All passwords must be alphanumeric (no special symbols).')
          .when("passwordRequired", {
            is: true,
            then: Yup.string().required("Must enter a password for the new account")
          }),
          name: Yup.string().required(),
          designation: Yup.string().required(),
          picture: Yup.string(),
        })}
        onSubmit={(values, {setSubmitting}) => {
          dispatch(editMode ?
            editCCAAccount({
              ccaId: editId,
              name: values.name,
              designation: values.designation,
              email: values.email,
              password: values.password,
            })
            :addCCAAccount({
              name: values.name,
              designation: values.designation,
              email: values.email,
              password: values.password,
              permissions: initialValues.permissions,
            })).then(() => {
              setSubmitting(false)
              setEditMode(false)
              handleClose()
            })
        }}
      >
        {({submitForm, isSubmitting})=>(
          <Form>
            <DialogContent> 
              <Grid container direction="row" justify="space-evenly" alignItems="center">
                <Grid item direction = "column" justify = "space-evenly" alignItems = "center" style = {{width: 200}}>
                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="name" required label="Name"/>
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="designation" required label="Designation"/>
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="email" required label="Email"/>
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="password" required type="password" label={editMode ? "New Password" : "Password"}/>
                  </Grid>
                </Grid>
                
              </Grid>
            </DialogContent>
            <DialogActions>
              {isSubmitting && <CircularProgress/>}

              <Button onClick={submitForm} color="primary">
                Save
              </Button>

              <Button autoFocus onClick={handleClose}>
                Cancel
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
      </Dialog>
    )

  }

  return (
    <div>
      {ccaDetails.isPending ? <LinearProgress /> :
        <div>
          <PanelBar style = {{fontWeight: 'bold'}} handleAdd={handleAdd} title={`CCA Accounts (${ccaDetails.ccaList.length})`} buttonText="Add CCA Account"/>
          {permissionMode ? <PermissionsDialog/> : <CCADialog />}
          <br/>
          <Container  >
            <Grid container spacing={3} >
            {
              ccaDetails.ccaList !== undefined &&
              ccaDetails.ccaList.map((ccaDetail,index) => (
                <Grid item xs={3}> 
                  <Card display='flex' elevation={7} style={{
                    marginLeft: 20, 
                    maxWidth: 275, 
                    }}>
                    <CardHeader
                      action={
                        
                        <EditDeleteMoreButton ccaId={ccaDetail.ccaId} active={ccaDetail.active}/>
                      }
                    />
                    <CardContent>
                      <Typography color="textPrimary" style = {{textAlign: 'left', fontSize: 20, fontWeight: 'bold'}}>{ccaDetail.name}</Typography>

                      <Typography color="textSecondary" style = {{fontWeight:500}}>{ccaDetail.designation}</Typography>
                      <br/>
                      <Typography color="textSecondary">{ccaDetail.email}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            }
            </Grid>
          </Container>
        </div>
        
      }
      <ErrorSnackbar stateError={ccaDetails.error} clearError={clearError}/>
    </div>
    
  )
}

const mapStateToProps = (state) => ({
  ccaDetails: state.ccaDetails,
})

export default connect(mapStateToProps) (CCAAccountPanel)