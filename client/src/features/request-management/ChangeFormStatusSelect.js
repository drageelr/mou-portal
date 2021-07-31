import React from 'react'
import { Select, FormControl, MenuItem } from '@material-ui/core'
import { changeFormStatus } from './requestListSlice'
import { useDispatch } from 'react-redux'

/**
  This is a stateful Select Menu that provides the admin with a list of statuses that they
  can associate to tasks. 

  @param {number} submissionId the id of the request whose status we are going to change, will be
  recieved from the store   
*/

export default function ChangeFormStatusSelect({submissionId, value, updateValue}) {
  const dispatch = useDispatch()
  const [localStatus, setLocalStatus] = React.useState(value)
  const [open, setOpen] = React.useState(false)

  function handleChange(e) {
    const newStatus = e.target.value
    setLocalStatus(newStatus)
    dispatch(changeFormStatus({submissionId, status: newStatus, issue: ""}))
    // updateValue(newStatus)
  }

  const options = ["Reviewed", "Approved", "Verified", "Issue", "Cancelled", "Signed" ]

  const statusColors = {
    "Reviewed": "#F1C231",
    "Cancelled": "#E24A00",
    "Verified": "#F1C231",
    "Issue": "#E24A00",
    "Approved": "#009D5E",
    "Write-Up": "#E24A00",
    "Signed": "#009D5E"
  }
  
  return (
    <div>
      <FormControl variant="outlined">
        <Select
          labelId = "status-label"
          id="label"
          open = {open}
          onClose={()=>setOpen(false)}
          value={localStatus}
          onOpen={()=>setOpen(true)}
          style={{height: 30, width: 200, backgroundColor: statusColors[localStatus] + '60'}}
          variant = "outlined"
          onChange={handleChange}
        >
        {
          options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)
        }
        {/* {
          disabledOptions.map((option, index) => <MenuItem key={index} disabled={true} value={option}>{option}</MenuItem>)
        } */}
        </Select>
      </FormControl>
    </div>
  )
}


