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
  root: {
    alignSelf: 'center'
  },
  itemPaper: {
    // backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(1),
    width: '40%',
    marginBottom: 5,
    marginLeft: -5,
    paddingTop: 7
  },
  sectionPaper: {
    padding: theme.spacing(2),
    height: '100%',
    marginBottom: 20,
    background: 'linear-gradient(to right bottom, #3274f3, #82b4ff)'
    // backgroundColor: theme.palette.primary.main,
  },
  formControl: {
    minWidth: '50%'
  }
}))

function SponsorForm({formData, submitMode, id, commentsData}) {
  const classes = useStyles()
  const [userType, setUserType] = React.useState("cca")


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
    <div>
      <FormViewerBar commentsData={{lastComment: {desc: 'CCA was here.', tsCreated: '05/05/2001'}}} submissionId={id} isCCA={userType==="cca"} submitMode={submitMode}/>
      <br/>
    
      <Container>
        <Formik
          validateOnChange={false} validateOnBlur={true}
          initialValues = {{
              sponsorName: '',
              sponsorAlias: '',
              sponsorEmail: '',
              amount: 0,
              tax: false
          }}
          validationSchema={Yup.object({
              sponsorName: Yup.string()
                .required('Required')
                .max(50,'Atmost 50 characters'),
              sponsorAlias: Yup.string()
                .required('Required')
                .max(50,'Atmost 50 characters'),
              sponsorEmail: Yup.string()
                .required('Required')
                .email('Invalid Email Address')
                .max(50,'Atmost 50 characters'),
              amount: Yup.number()
                .required('Required'),
              tax: Yup.bool()
                .required('Required')
          })}
          onSubmit={ (values, { setSubmitting }) => {
              // get society ID from society user
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
              <Field
                className={classes.itemPaper}
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
                className={classes.itemPaper}
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
                className={classes.itemPaper}                
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
              <Field
                className={classes.itemPaper}
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
                style={{marginLeft: 10}}
                component={CheckboxWithLabel}
                type="checkbox"
                color="primary"
                name="tax"
                Label={{ label: 'Tax included' }}
              />
              <br/><br/>
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
                    <Button variant="outlined" disabled={false} component="span" startIcon={<CloudUploadIcon/>}>
                      Upload PDF
                    </Button>
                    {/* <p>{data.length !==0 && `Uploaded File [${data.substr(data.length - 7)}]`}</p> */}
                  </label>
                </div> : 
                <Button variant="outlined" onClick={handleFileChange} component="span" startIcon={<GetAppIcon/>}>
                  Download File
                </Button>
              }
              <br/>
              <Button size="large" onClick={submitForm} type="submit"
              variant="contained" color="primary" spacing= '10'>
                Submit
              </Button>
              <br/><br/>
            </Form>
            
          )}
        </Formik>
        
      </Container>
    </div>
  )
}

const mapStateToProps = (state) => ({ //needs both the template and data to render the form
  formData: state.formData,
  userType: state.user.userType,
})


export default connect(mapStateToProps) (SponsorForm)