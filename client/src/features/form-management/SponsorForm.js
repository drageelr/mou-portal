import React, {useEffect, useState} from 'react'
import {Formik, Form, Field} from 'formik'
import FormViewerBar from './FormViewerBar'
import {makeStyles, List, Paper, Container, Button, LinearProgress, MenuItem, InputLabel, FormControl } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import GetAppIcon from '@material-ui/icons/GetApp'
import { connect } from 'react-redux'
import ErrorSnackbar from '../../ui/ErrorSnackbar'
import * as Yup from 'yup'
import { TextField, CheckboxWithLabel, Select } from 'formik-material-ui';


const useStyles = makeStyles((theme) => ({
  sectionPaper: {
    padding: theme.spacing(2),
    height: '100%',
    marginBottom: 20,
    background: 'linear-gradient(to right bottom, #3274f3, #82b4ff)'
    // backgroundColor: theme.palette.primary.main,
  },
  formControl: {
    minWidth: '30%'
  }
}))

function SponsorForm({formData}) {
  const classes = useStyles()
  const [userType, setUserType] = React.useState("CCA")


  async function handleFileChange(e){
    if (!false) {
      const formData = new FormData();
      formData.append("", e.target.files[0], e.target.files[0].name) // create multipart form data
      // const uploadFileResult = await uploadFile(formData))
      // const fileToken = unwrapResult(uploadFileResult)
      // dispatch(setItemData({itemId: id, data: fileToken}))
    }
    else { //file downloads in review mode
      // dispatch(downloadFile({itemId: id, submissionId, fileName: `s${submissionId}_${label.toLowerCase()}`}))
    }
  }


  return (
    <Container component="main" className={classes.root}>
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues = {{
            sponsorName: '',
            sponsorAlias: '',
            sponsorEmail: '',
            societyID: 0,
            amount: 0,
            tax: false
        }}
        validationSchema={Yup.object({
            sponsorName: Yup.string()
              .required('Required'),
            sponsorAlias: Yup.string()
              .required('Required'),
            sponsorEmail: Yup.string()
              .email('Invalid Email Address')
              .required('Required'),
            societyID: Yup.number()
              .required('Required'),
            amount: Yup.number()
              .required('Required'),
            tax: Yup.bool()
              .required('Required')
        })}
        onSubmit={ (values, { setSubmitting }) => {
            // tsCreated
            // login({email: values.email, password: values.password, userType: userType})
            // .then(() => {
            //   setSubmitting(false)
            // }) 
          }
        }
      >
        {({submitForm, isSubmitting})=>(
          <Form>
            <h1 style={{color: "white"}}>Login</h1>      

            <Field
              style = {{backgroundColor: 'white'}}
              component={TextField}
              variant="filled"
              margin="normal"
              required
              label="Sponsor Name"
              name="sponsorName"
            ></Field>
            <br/>
            <Field
              style = {{backgroundColor: 'white'}}
              component={TextField}
              variant="filled"
              margin="normal"
              required
              label="Sponsor Alias"
              name="sponsorAlias"
            ></Field>
            <br/>
            <Field
              style = {{backgroundColor: 'white'}}
              component={TextField}
              variant="filled"
              margin="normal"
              required
              type="email"
              label="Sponsor Email"
              name="sponsorEmail"
            ></Field>
            <br/>            
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="societyID">Society</InputLabel>
              <Field
                component={Select}
                name="societyID"
                inputProps={{
                  id: 'societyID',
                }}
              >
                <MenuItem value={0}>LUMUN</MenuItem>
                <MenuItem value={1}>SPADES</MenuItem>
                <MenuItem value={2}>LAS</MenuItem>
              </Field>
            </FormControl>
            <br/>
            <Field
              style = {{backgroundColor: 'white'}}
              component={TextField}
              variant="filled"
              margin="normal"
              required
              type="number"
              label="Amount"
              name="amount"
            ></Field>
            <br/>
            <Field
              component={CheckboxWithLabel}
              type="checkbox"
              name="tax"
              Label={{ label: 'Tax included' }}
            />
            <br/>
            {
              !false ?
              <div>
                <input
                  accept={['.pdf']}
                  id={`file-1`}
                  hidden // hide input html since MuiButton html will be used
                  type="file"
                  onChange={handleFileChange} //single files only, at the first index in FileList
                />
                <label htmlFor={`file-1`}>
                  <Button variant="contained" disabled={false} component="span" startIcon={<CloudUploadIcon/>}>
                    Upload PDF
                  </Button>
                  {/* <p>{data.length !==0 && `Uploaded File [${data.substr(data.length - 7)}]`}</p> */}
                </label>
              </div> : 
              <Button variant="contained" onClick={handleFileChange} component="span" startIcon={<GetAppIcon/>}>
                Download File
              </Button>
            }
            <br/>
            <Button size="large" onClick={submitForm} type="submit"
            variant="contained" color="secondary" spacing= '10'>
              Login
            </Button>
          </Form>
        )}
      </Formik>
      
    </Container>
  )
}