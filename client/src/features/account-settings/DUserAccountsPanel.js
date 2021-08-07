import React, {useState,useEffect} from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Button, Dialog, DialogContent, DialogTitle, 
  DialogActions, Grid, CircularProgress, LinearProgress, Typography, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core'
import {addDUserAccount, editDUserAccount, fetchDUserAccounts} from './duserDataSlice'
import {connect} from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import MoreButton from '../../ui/MoreButton'
import * as Yup from 'yup'
import EditIcon from '@material-ui/icons/Edit'
import {clearError} from './duserDataSlice'
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


function DUserAccountsPanel({duserData, departmentList, dispatch}) {
  useEffect(() => {
    dispatch(fetchDUserAccounts())
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

  function handleEdit(duserId){
    setEditId(duserId)
    setEditMode(true)  
    setIsOpen (true)
  }

  function DUserDialog(){

    let initialValues = {
      name:'',
      email: '',
      deptId: 1,
    }

    if (editMode){
      const duserDetail = duserData.duserList.find((duser,index) =>{
        return duser.duserId === editId
      })
      if (duserDetail !== undefined){
          initialValues = {
          name: duserDetail.name,
          email: duserDetail.email,
          deptId: duserDetail.deptId,
        }
      }  
    }

    function handleClose(){
      setIsOpen(false)
    }

    function handleDepartmentChange(e) {

    }

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        
        >
        <DialogTitle style={{ cursor: 'move' }} >
          {editMode ? "Edit Department Member Account" : "Add Department Member Account"}
        </DialogTitle>

        <Formik
          validateOnChange={false} validateOnBlur={true}
          initialValues={initialValues}
          validationSchema={Yup.object({
            email: Yup.string()
                .email('Invalid Email Address')
                .required('Required'),
            deptId: Yup.number()
              .required('Required'),
            name: Yup.string()
            .required('Required')
            .max(50,'Must be atmost 50 characters')
          })}
          onSubmit={(values,{setSubmitting}) => {
            dispatch(editMode? 
              editDUserAccount({
                duserId: editId, 
                name: values.name,
                email: values.email,
                deptId: values.deptId
              })
              :addDUserAccount({
                name: values.name,
                email: values.email,
                deptId: values.deptId
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
                  
                  <Grid item >
                    <FormControl variant="outlined">
                      <InputLabel>Department</InputLabel>
                      <Select 
                      name="deptId" 
                      label="Department" 
                      value={initialValues.deptId}
                      style={{width: 350, marginBottom: 10}}
                      onChange={(e) => handleDepartmentChange(e)}>
                        {
                          departmentList.map((department, index) => {
                            return (
                              <MenuItem key={index}  value={department.deptId}>{department.name}</MenuItem>
                            )
                          })
                        }
                      </Select>
                    </FormControl>
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
      duserData.isPending? <LinearProgress variant = "indeterminate"/>:
      <div>
        <PanelBar handleAdd={handleAdd} title={`Department Members (${duserData.duserList.length})`} buttonText="Add Department Member"/>
        <DUserDialog/>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Email</TableCell>  
                </TableRow>
              </TableHead>
                
              <TableBody>
              {duserData.duserList.map((duser,index) => (
                duserData.isPending? <CircularProgress variant = "indeterminate"/>:
                <TableRow key={index} style={{background: duser.active ? theme.palette.action.hover : theme.palette.action.disabledBackground}}>
                  <TableCell><Typography>{duser.name}</Typography></TableCell>
                  <TableCell><Typography>{duser.deptId}</Typography></TableCell>
                  <TableCell><Typography>{duser.email}</Typography></TableCell>
                  <TableCell>
                    <Button startIcon={<EditIcon/>} onClick={()=>handleEdit(duser.duserId)}> Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
              
            </Table>
          </TableContainer>
        </Paper>
      </div>
      }
      <ErrorSnackbar stateError={duserData.error} clearError={clearError} />
    </div>
    )
}


const mapStateToProps = (state) => ({
  duserData: state.duserData,
  departmentList: state.departmentData.departmentList
})

export default connect(mapStateToProps) (DUserAccountsPanel)