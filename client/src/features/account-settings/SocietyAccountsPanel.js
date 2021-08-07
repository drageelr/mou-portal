import React, {useState,useEffect} from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Button, Dialog, DialogContent, DialogTitle, 
  DialogActions, Grid, CircularProgress, LinearProgress, Typography} from '@material-ui/core'
import {addSocietyAccount, editSocietyAccount, fetchSocietyAccounts} from './societyDataSlice'
import {connect} from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import MoreButton from '../../ui/MoreButton'
import * as Yup from 'yup'
import EditIcon from '@material-ui/icons/Edit'
import {clearError} from './societyDataSlice'
import ErrorSnackbar from '../../ui/ErrorSnackbar'
import PanelBar from './PanelBar'


const useStyles = makeStyles({
  root: {
    width: '100%',
    maxHeight: '100%',
    overflow: 'auto'
  },
  container: {
    maxHeight: '70%',
  },
})


function SocietyAccountsPanel({societyData,dispatch}) {
  useEffect(() => {
    dispatch(fetchSocietyAccounts())
  },[])

  const classes = useStyles()
  const theme = useTheme()
  const [isOpen,setIsOpen] = useState(false)
  const [editMode,setEditMode] = useState(false)
  const [editId, setEditId] = useState(-1)

  function handleAdd(){
    setEditMode(false)  
    setIsOpen (true)
  }

  function handleEdit(societyId){
    setEditId(societyId)
    setEditMode(true)  
    setIsOpen (true)
  }

  function SocietyDialog(){

    let initialValues = {
      name:'',
      email: '',
      initials: ''
    }

    if (editMode){
      const societyDetail = societyData.societyList.find((society,index) =>{
        return society.societyId === editId
      })
      if (societyDetail !== undefined){
          initialValues = {
          name: societyDetail.name,
          email: societyDetail.email,
          initials: societyDetail.initials
        }
      }  
    }

    function handleClose(){
      setIsOpen(false)
    }

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        
        >
        <DialogTitle style={{ cursor: 'move' }} >
          {editMode ? "Edit Society Account" : "Add Society Account"}
        </DialogTitle>

        <Formik
          validateOnChange={false} validateOnBlur={true}
          initialValues={initialValues}
          validationSchema={Yup.object({
            email: Yup.string()
                .email('Invalid Email Address')
                .required('Required'),
            name: Yup.string()
            .required('Required')
            .max(50,'Must be atmost 50 characters'),
            initials: Yup.string()
            .required('Required')
            .max(10, 'Must be at most 10 characters'),
          })}
          onSubmit={(values,{setSubmitting}) => {
            dispatch(editMode? 
              editSocietyAccount({
                societyId: editId, 
                name: values.name,
                email: values.email,
                initials: values.initials,
              })
              :addSocietyAccount({
                name: values.name,
                email: values.email,
                initials: values.initials,
            })).then(()=>{
              setSubmitting(false)
            })
            handleClose()
          }}
        >
          {({submitForm, isSubmitting}) => (
            <Form>
              <DialogContent>
                <Grid container direction = "column" justify = "center" alignItems = "center" style = {{width: 400}}>
                  <Grid item style = {{width: 350, marginBottom: 10}}>
                    <Field component={TextField} name="name" required label="Name"/>
                  </Grid>

                  <Grid item style = {{width: 350, marginBottom: 10}}>
                    <Field component={TextField} name="initials" required label="Initials"/>
                  </Grid>
                  
                  <Grid item style = {{width: 350, marginBottom: 10}}>
                    <Field component={TextField} name="email" type="email" required label="Email"/>    
                  </Grid>

                </Grid>
              </DialogContent>
              {isSubmitting && <CircularProgress />}
              <DialogActions>
                <Button 
                  onClick={submitForm} 
                  color="primary"
                  disabled={isSubmitting}
                  >
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
    {
      societyData.isPending? <LinearProgress variant = "indeterminate"/>:
      <div>
        <PanelBar handleAdd={handleAdd} title={`Society Accounts (${societyData.societyList.length})`} buttonText="Add Society Account"/>
        <SocietyDialog/>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>Society Name</TableCell>
                  <TableCell>Society Initials</TableCell>
                  <TableCell>Society Email</TableCell>  
                </TableRow>
              </TableHead>
                
              <TableBody>
              {societyData.societyList.map((society,index) => (
                societyData.isPending? <CircularProgress variant = "indeterminate"/>:
                <TableRow key={index} style={{background: society.active ? theme.palette.action.hover : theme.palette.action.disabledBackground}}>
                  <TableCell component="th" scope="row">
                    <Typography>{society.initials}</Typography>
                  </TableCell>
                  <TableCell><Typography>{society.name}</Typography></TableCell>
                  <TableCell><Typography>{society.email}</Typography></TableCell>
                  <TableCell>
                    <Button startIcon={<EditIcon/>} onClick={()=>handleEdit(society.societyId)}> Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
              
            </Table>
          </TableContainer>
        </Paper>
      </div>
      }
      <ErrorSnackbar stateError={societyData.error} clearError={clearError} />
    </div>
    )
}


const mapStateToProps = (state) => ({
  societyData: state.societyData,
})

export default connect(mapStateToProps) (SocietyAccountsPanel)