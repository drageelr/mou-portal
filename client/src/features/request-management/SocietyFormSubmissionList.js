import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Box, Typography } from '@material-ui/core'
import MUIDataTable from "mui-datatables"
import LinearProgress from '@material-ui/core/LinearProgress'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { makeStyles } from '@material-ui/core/styles'
import { fetchSocietyList, clearError } from './submissionListSlice'
import { useHistory } from 'react-router-dom'
import ErrorSnackbar from '../../ui/ErrorSnackbar'
import Timestamp from 'react-timestamp'


const useStyles = makeStyles((theme) => ({
  submissionListPaper: {
    height: '90vh',
    width: '80vw',
  }
}))

export function SocietyFormSubmissionView({user, submissionListData, dispatch}) {
  const history = useHistory()
  const classes = useStyles()
  useEffect(() => {
    dispatch(fetchSocietyList())
  }, [])
  
  const statusTypes = ["Reviewed", "Approved", "Verified", "Issue", "Cancelled", "Signed" ]

  const statusColors = {
    "Reviewed": "#F1C231",
    "Cancelled": "#E24A00",
    "Verified": "#F1C231",
    "Issue": "#E24A00",
    "Approved": "#009D5E",
    "Write-Up": "#E24A00",
    "Signed": "#009D5E"
  }
  
  const numStatuses = statusTypes.length

  function selectValue(formStatus) {
    return (statusTypes.indexOf(formStatus) + 1) * 100 / numStatuses
  }  

  const options = {
    searchOpen:false,
    print:false,
    download:false,
    viewColumns:false,
    disableToolbarSelect: true,
    selectableRows:false,
    rowsPerPage: 6
  }

  const columns = [
    {
      name:"Submitted Form",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Typography variant="h5" style={{fontSize: 12, fontWeight: 600}}>
              {value}
            </Typography>
          )
        }
      }
    },
    {
      name: "Last edited",
      options: {
        filter: false,
        sort: true,
        sortDirection: 'desc',
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box color="text.secondary" >
              <DateRangeIcon style={{marginBottom: -5, marginRight: 4}}/>
              <Timestamp date={new Date(value)}/>
            </Box> 
          )
        },
      },
    },
    {
      name:"Approval Progress",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <LinearProgress 
            value={value}
            thickness={15}  
            variant="determinate"
            /> 
          )
        }
      }
    },
    {
      name:"Form Status",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box borderRadius={5} color="secondary.main" style={{
              backgroundColor: statusColors[value],
              padding: 5,
              maxWidth: '9vw',
              }}>
              <Typography variant="h5" style={{fontSize: 12, fontWeight: 700}}>
                {value}
              </Typography>
            </Box> 
          )
        }
      }
    }, 
    {
      name:"",
      options: {
        filter: false,
        print: false,
        download: false,
        sort: false
      }
    },
  ]

  return (
    <div className={classes.submissionListPaper} style={{position: 'absolute', marginLeft: '20%'}}>
      <MUIDataTable
        title={"Submissions"} 
        data={
          submissionListData.formDataList.map((submission, index) => [
            submission.formTitle,
            submission.timestampModified,
            selectValue(submission.status),
            submission.status,
            <Button key={index} variant="outlined" 
            color="primary" 
            style={{marginRight: -30}}
            onClick={()=>history.push(`/sponsor-mou/edit/${submission.submissionId}`)}
            >
              view submission
            </Button>
          ])
        } 
        columns={columns} 
        options={options}
      />
      <ErrorSnackbar stateError={ submissionListData.error } clearError={clearError}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  submissionListData: state.submissionListData
})

export default connect(mapStateToProps)(SocietyFormSubmissionView)
