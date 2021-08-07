import React, {useState,useEffect} from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Button, Dialog, DialogContent, DialogTitle, 
  DialogActions, Grid, CircularProgress, LinearProgress, Typography} from '@material-ui/core'
import {addDepartment, editDepartment, fetchDepartments} from './departmentDataSlice'
import {connect} from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import EditIcon from '@material-ui/icons/Edit'
import {clearError} from './departmentDataSlice'
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


function DepartmentPanel({departmentData, dispatch}) {
  useEffect(() => {
    dispatch(fetchDepartments())
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

  function handleEdit(deptId){
    setEditId(deptId)
    setEditMode(true)  
    setIsOpen (true)
  }

  function DepartmentDialog(){

    let initialValues = {
      name:'',
    }

    if (editMode){
      const departmentDetail = departmentData.departmentList.find((department,index) =>{
        return department.deptId === editId
      })
      if (departmentDetail !== undefined){
          initialValues = {
          name: departmentDetail.name,
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
          {editMode ? "Edit Department" : "Add Department"}
        </DialogTitle>

        <Formik
          validateOnChange={false} validateOnBlur={true}
          initialValues={initialValues}
          validationSchema={Yup.object({ 
            name: Yup.string()
            .required('Required')
            .max(50,'Must be atmost 50 characters')
          })}
          onSubmit={(values,{setSubmitting}) => {
            dispatch(editMode? 
              editDepartment({
                deptId: editId, 
                name: values.name
              })
              :addDepartment({
                name: values.name
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
      departmentData.isPending? <LinearProgress variant = "indeterminate"/>:
      <div>
        <PanelBar handleAdd={handleAdd} title={`Departments (${departmentData.departmentList.length})`} buttonText="Add Department"/>
        <DepartmentDialog/>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>Department Name</TableCell>
                </TableRow>
              </TableHead>
                
              <TableBody>
              {departmentData.departmentList.map((department,index) => (
                departmentData.isPending? <CircularProgress variant = "indeterminate"/>:
                <TableRow key={index} style={{background: department.active ? theme.palette.action.hover : theme.palette.action.disabledBackground}}>
                  <TableCell><Typography>{department.name}</Typography></TableCell>
                  <TableCell>
                    <Button startIcon={<EditIcon/>} onClick={()=>handleEdit(department.deptId)}> Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
              
            </Table>
          </TableContainer>
        </Paper>
      </div>
      }
      <ErrorSnackbar stateError={departmentData.error} clearError={clearError} />
    </div>
    )
}


const mapStateToProps = (state) => ({
  departmentData: state.departmentData,
})

export default connect(mapStateToProps) (DepartmentPanel)