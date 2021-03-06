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
import { addCCAAccount, editCCAAccount, fetchCCAAccounts, clearError, editCCAPermissions } from './ccaDetailsSlice'


function CCAAccountPanel({ccaDetails, dispatch}) {

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
    const ccaMember = ccaDetails.ccaList.find((member,index) => {
      return member.ccaId === ccaId
    })
    if(ccaMember !== undefined){
      setPermissions(ccaMember.permissions)
    }
    setPermissionsMode(true)
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
        text: 'Manage Permissions',
        icon: <AccessibilityIcon/>,
        onClick: () => handlePermissions(ccaId)
      }
    ]
    return <MoreButton menuBtnStyle={{float: 'right'}} vertical menusList={menusList}/>
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
            control={<Switch color="primary" size="small" checked={permissions.accountAccess} onChange={handlePermissionsChange} name="account"/>}
            label="Account Access"
            style={{marginBottom: 8}}
          />
          <FormControlLabel
            control={<Switch color="primary" size="small" checked={permissions.approvalAccess} onChange={handlePermissionsChange} name="approval"/>}
            label="Approval Access"
            style={{marginBottom: 8}}
          />
          <FormControlLabel
            control={<Switch color="primary" size="small" checked={permissions.reviewAccess} onChange={handlePermissionsChange} name="review"/>}
            label="Review Access"
            style={{marginBottom: 8}}
          />
          <FormControlLabel
            control={<Switch color="primary" size="small" checked={permissions.cancelAccess} onChange={handlePermissionsChange} name="cancel"/>}
            label="Cancel Access"
            style={{marginBottom: 8}}
          />
          <FormControlLabel
            control={<Switch color="primary" size="small" checked={permissions.logAccess} onChange={handlePermissionsChange} name="log"/>}
            label="View Logs of MoU"
            style={{marginBottom: 8}}
          />
          <FormControlLabel
            control={<Switch color="primary" size="small" checked={permissions.categoryAccess} onChange={handlePermissionsChange} name="category"/>}
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
      permissions: {
        account: true,
        approval: true,
        review: true,
        verify: true,
        cancel: true,
        log: true,
        category: true
      }
    }

    if(editMode){
      const ccaMember = ccaDetails.ccaList.find((member,index) => {
        return member.ccaId === editId
      })
      if(ccaMember !== undefined){
        initialValues = {
          ...ccaMember
        }
      }
    }

    return(
      <Dialog 
        open={isOpen}
        onClose={handleClose}
        
      >

      <DialogTitle style={{ cursor: 'move' }} >
        {editMode ? "Edit Account" : "Add Account"}
      </DialogTitle>
      
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues = {initialValues}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid Email Address')
            .max(50,'Atmost 50 characters')
            .required('Required'),
          name: Yup.string()
            .required()
            .max(50,'Atmost 50 characters'),
          designation: Yup.string()
            .required()
            .max(50,'Atmost 50 characters'),
        })}
        onSubmit={(values, {setSubmitting}) => {
          dispatch(editMode ?
            editCCAAccount({
              ccaId: editId,
              name: values.name,
              designation: values.designation,
              email: values.email,
            })
            :addCCAAccount({
              name: values.name,
              designation: values.designation,
              email: values.email,
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
                <Grid item direction = "column" justify = "space-evenly" alignItems = "center" style = {{width: 250}}>
                  <Grid item>
                    <Field style={{width: 235}} component={TextField} name="name" required label="Name"/>
                  </Grid>

                  <Grid item>
                    <Field style={{width: 235}} component={TextField} name="designation" required label="Designation"/>
                  </Grid>

                  <Grid item>
                    <Field style={{width: 235}} component={TextField} name="email" required label="Email"/>
                  </Grid>

                  <br/>
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
          <Container  style={{marginLeft: 0}} >
            <Grid container spacing={2} >
            {
              ccaDetails.ccaList !== undefined &&
              ccaDetails.ccaList.map((ccaDetail,index) => (
                <Grid item xs={4}> 
                  <Card display='flex' elevation={7} style={{
                    marginLeft: 20, 
                    maxWidth: 275, 
                    }}>
                    <CardContent>
                      <EditDeleteMoreButton ccaId={ccaDetail.ccaId} active={ccaDetail.active}/>

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