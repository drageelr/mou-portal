import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Drawer, Button, Paper, List, Typography, Box} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { useDispatch } from 'react-redux'
import { addComment } from './formDataSlice'
import Timestamp from 'react-timestamp'

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    padding: theme.spacing(2),
    width: '22vw',
  },
  commentsPaper: {
    overflow:'auto',
    height: '30vh',
  },
  commentObjectPaper: {
    padding: 2, 
    borderRadius: 3, 
    margin: 8, 
    width: '20vw',
    backgroundColor: theme.palette.primary.main,
    color: 'white'
  }
}))

export default function FormSideBar({drawerOpen, toggleDrawer, commentsData, isCCA}) {
  const { lastComment } = commentsData
  const classes = useStyles()
  const dispatch = useDispatch()

  function CommentBox({comment}) {
    return <Box borderRadius={8} border={1} borderColor="grey.400" className={classes.commentsPaper}>
      <Paper className={classes.commentObjectPaper} >
        <Typography style={{margin: 5, fontWeight: 500}}>
          {comment.desc}
        </Typography>
        <Typography style={{margin: 4, marginLeft: 5, fontSize: 10}}>
          {
            (comment.tsCreated === "just now") 
            ? "just now"
            : <Timestamp relative date={new Date(comment.tsCreated)}/>
          }
          
        </Typography>
      </Paper>
    </Box>
  }

  function CcaCommentBox() {
    return (
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues={{newComment: ''}}
        validate={values => {
          const errors = {}
          if (values.newComment.length > 100) {
            errors.newComment = 'Please do not exceed 100 characters.'
          }
          return errors
        }}
        onSubmit={(values) => {
          dispatch(addComment(values.newComment))
        }}
      >
        {({ submitForm}) => (
          <Form>
            <CommentBox comment={lastComment}/>
            {
              isCCA &&
              <div>
                <Field component={TextField} multiline rows={2} required variant="outlined" fullWidth name="newComment" label="Add Comment"/>
                <Button variant="contained" color="primary" onClick={submitForm} style={{marginTop: 8}}>Add CCA Comment</Button>
              </div>
            }
            <Button variant="contained" onClick={toggleDrawer} style={{marginLeft: 10, marginTop: 8}}>Close</Button>
          </Form>
        )}
      </Formik>
    )
  }

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer} classes={{paper: classes.drawerPaper}}>
      <CcaCommentBox/>
    </Drawer>
  )
}
