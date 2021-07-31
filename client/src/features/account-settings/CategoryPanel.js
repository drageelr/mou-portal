import React, {useState,useEffect} from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Button, Dialog, DialogContent, DialogTitle, 
  DialogActions, Grid, CircularProgress, LinearProgress, Typography} from '@material-ui/core'
import {addCategory, editCategory, fetchCategories} from './categoryDataSlice'
import {connect} from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
import {clearError} from './categoryDataSlice'
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


function CategoryPanel({categoryData, dispatch}) {
  useEffect(() => {
    dispatch(fetchCategories())
  },[])

  const classes = useStyles()
  const theme = useTheme()
  const [isOpen,setIsOpen] = useState(false)
  const [editMode,setEditMode] = useState(false)
  const [mileageOpen, setMileageOpen] = useState(false)
  const [editId, setEditId] = useState(-1)


  function handleAdd(){
    setEditMode(false)  
    setIsOpen (true)
  }

  function handleEdit(categoryId){
    setEditId(categoryId)
    setEditMode(true)  
    setIsOpen (true)
  }

  function handleAddMileage(categoryId){
    setEditId(categoryId)
    setMileageOpen(true)
  }


  function CategoryMileageDialog(){

    if (editMode){
      const categoryDetail = categoryData.categoryList.find((category,index) =>{
        return category.categoryId === editId
      })
      if (categoryDetail !== undefined){

      }  
    }

    function handleMileageClose(){
      setMileageOpen(false)
    }

    return (
      <Dialog
        open={mileageOpen}
        onClose={handleMileageClose}
        >
        <DialogTitle style={{ cursor: 'move' }}>
          Add Mileages
        </DialogTitle>

      </Dialog>
    )
  }


  function CategoryDialog(){

    let initialValues = {
      name:'',
      lowerBound: 0,
      upperBound: 5000
    }

    if (editMode){
      const categoryDetail = categoryData.categoryList.find((category,index) =>{
        return category.categoryId === editId
      })
      if (categoryDetail !== undefined){
          initialValues = {
          name: categoryDetail.name,
          lowerBound: categoryDetail.lowerBound,
          upperBound: categoryDetail.upperBound
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
          {editMode ? "Edit Category " : "Add Category "}
        </DialogTitle>

        <Formik
          validateOnChange={false} validateOnBlur={true}
          initialValues={initialValues}
          validationSchema={Yup.object({
            name: Yup.string()
            .required('Required')
            .max(50,'Must be atmost 50 characters'),
            lowerBound: Yup.number()
            .required('Required')
            .min(0),
            upperBound: Yup.number()
            .required('Required')
            .min(0),
          })}
          onSubmit={(values,{setSubmitting}) => {
            dispatch(editMode? 
              editCategory({
                categoryId: editId, 
                name: values.name,
                lowerBound: values.lowerBound,
                upperBound: values.upperBound
              })
              :addCategory({
                name: values.name,
                lowerBound: values.lowerBound,
                upperBound: values.upperBound
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
                    <Field component={TextField} name="lowerBound" required type="number" label="From (Lower Bound)"/>
                  </Grid>

                  <Grid item style = {{width: 350, marginBottom: 10}}>
                    <Field component={TextField} name="upperBound" required type="number" label="To (Upper Bound)"/>
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
      categoryData.isPending? <LinearProgress variant = "indeterminate"/>:
      <div>
        <PanelBar handleAdd={handleAdd} title={`Categories (${categoryData.categoryList.length})`} buttonText="Add Category"/>
        <CategoryDialog/>
        <CategoryMileageDialog/>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Lower Bound</TableCell>
                  <TableCell>Upper Bound</TableCell>  
                </TableRow>
              </TableHead>
                
              <TableBody>
              {categoryData.categoryList.map((category,index) => (
                categoryData.isPending? <CircularProgress variant = "indeterminate"/>:
                <TableRow key={index} style={{background: category.active ? theme.palette.action.hover : theme.palette.action.disabledBackground}}>
              
                  <TableCell><Typography>{category.name}</Typography></TableCell>
                  <TableCell><Typography>{category.lowerBound}</Typography></TableCell>
                  <TableCell><Typography>{category.upperBound}</Typography></TableCell>
                  <TableCell>
                    <Button startIcon={<EditIcon/>} onClick={()=>handleEdit(category.categoryId)}> Edit</Button>
                  </TableCell>
                  <TableCell>
                    <Button startIcon={<AddIcon/>} onClick={()=>handleAddMileage(category.categoryId)}> Add Mileage</Button>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
              
            </Table>
          </TableContainer>
        </Paper>
      </div>
      }
      <ErrorSnackbar stateError={categoryData.error} clearError={clearError} />
    </div>
    )
}


const mapStateToProps = (state) => ({
  categoryData: state.categoryData,
})

export default connect(mapStateToProps) (CategoryPanel)