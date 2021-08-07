import React, {useState,useEffect} from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Button, Dialog, DialogContent, DialogTitle, 
  DialogActions, Grid, CircularProgress, LinearProgress, Typography, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import {addMileage, editMileage, fetchMileages} from './mileageDataSlice'
import {connect} from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField, CheckboxWithLabel, Checkbox  } from 'formik-material-ui'
import * as Yup from 'yup'
import EditIcon from '@material-ui/icons/Edit'
import {clearError} from './mileageDataSlice'
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


function MileagePanel({ mileageData, departmentList, dispatch }) {
  useEffect(() => {
    dispatch(fetchMileages())
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

  function handleEdit(mileageId){
    setEditId(mileageId)
    setEditMode(true)  
    setIsOpen (true)
  }

  function MileageDialog(){

    let initialValues = {
      description:'',
      deptId: 0,
      ccaCheck: true,
      societyCheck: false,
    }

    if (editMode){
      const mileageDetail = mileageData.mileageList.find((mileage,index) =>{
        return mileage.mileageId === editId
      })
      if (mileageDetail !== undefined){
        initialValues = {
          description: mileageDetail.description,
          deptId: mileageDetail.deptId,
          ccaCheck: mileageDetail.ccaCheck,
          societyCheck: mileageDetail.societyCheck,
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
          {editMode ? "Edit Mileage" : "Add Mileage"}
        </DialogTitle>

        <Formik
          validateOnChange={false} validateOnBlur={true}
          initialValues={initialValues}
          validationSchema={Yup.object({
            description: Yup.string()
            .required('Required')
            .max(250,'Must be atmost 250 characters'),
            deptId: Yup.number()
            .required('Required'),
            ccaCheck: Yup.bool()
            .required('Required'),
            societyCheck: Yup.bool()
            .required('Required'),
            
          })}
          onSubmit={(values,{setSubmitting}) => {
            dispatch(editMode? 
              editMileage({
                mileageId: editId, 
                description: values.description,
                deptId: values.deptId,
                ccaCheck: values.ccaCheck,
                societyCheck: values.societyCheck
              })
              :addMileage({
                description: values.description,
                deptId: values.deptId,
                ccaCheck: values.ccaCheck,
                societyCheck: values.societyCheck
            })).then(()=>{
              setSubmitting(false)
            })
            handleClose()
          }}
        >
          {({submitForm, isSubmitting}) => (
            <Form>
              <DialogContent>
                <Grid container direction = "column" justify = "center" alignItems = "center" style = {{width: 450}}>
                  <Grid item>
                    <Field style = {{width: 400, marginBottom: 10}}
                    component={TextField} 
                    name="description" 
                    required label="Description"/>
                  </Grid>

                  <Grid item >
                    <FormControl variant="outlined">
                      <InputLabel>Department</InputLabel>
                      <Select 
                      name="deptId" 
                      label="Department" 
                      value={initialValues.deptId}
                      style={{width: 400, marginBottom: 10}}
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

                  <Grid item style = {{width: 400, marginBottom: 10}}>
                    <Field
                      style={{marginLeft: 10}}
                      component={CheckboxWithLabel}
                      type="checkbox"
                      name="ccaCheck"
                      color="primary"
                      Label={{ label: 'Is the CCA responsible?' }}
                    />
                  </Grid>

                  <Grid item style = {{width: 400, marginBottom: 10}}>
                    <Field
                      style={{marginLeft: 10}}
                      component={CheckboxWithLabel}
                      type="checkbox"
                      name="societyCheck"
                      color="primary"
                      Label={{ label: 'Is the society responsible?' }}
                    />
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
      mileageData.isPending? <LinearProgress variant = "indeterminate"/>:
      <div>
        <PanelBar handleAdd={handleAdd} title={`Sponsor Mileages (${mileageData.mileageList.length})`} buttonText="Add Mileage"/>
        <MileageDialog/>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Department ID</TableCell>
                  <TableCell>CCA Check</TableCell>
                  <TableCell>Society Check</TableCell>
                </TableRow>
              </TableHead>
                
              <TableBody>
              {mileageData.mileageList.map((mileage,index) => (
                mileageData.isPending? <CircularProgress variant = "indeterminate"/>:
                <TableRow key={index} style={{background: mileage.active ? theme.palette.action.hover : theme.palette.action.disabledBackground}}>
                  {/* <TableCell component="th" scope="row">
                    <Typography>{mileage.nameInitials}</Typography>
                  </TableCell> */}
                  <TableCell><Typography>{mileage.description}</Typography></TableCell>
                  <TableCell><Typography>{mileage.deptId}</Typography></TableCell>
                  <TableCell><Typography>{mileage.ccaCheck ? "✔️" : "❌"}</Typography></TableCell>
                  <TableCell><Typography>{mileage.societyCheck ? "✔️" : "❌"}</Typography></TableCell>
                  <TableCell>
                    <Button startIcon={<EditIcon/>} onClick={()=>handleEdit(mileage.mileageId)}> Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
              
            </Table>
          </TableContainer>
        </Paper>
      </div>
      }
      <ErrorSnackbar stateError={mileageData.error} clearError={clearError} />
    </div>
    )
}


const mapStateToProps = (state) => ({
  mileageData: state.mileageData,
  departmentList: state.departmentData.departmentList
})

export default connect(mapStateToProps) (MileagePanel)