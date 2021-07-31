import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Typography} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import BusinessIcon from '@material-ui/icons/Business';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { makeStyles, Container, Card } from '@material-ui/core';

/**
  The CCASettingsHome constitutes buttons for the following: Change Password, CCA Accounts,
  Society Accounts, and Task Status Panel.
 */
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  ccaSettingsTitle: {
    padding: theme.spacing(2),
    marginTop: 10,
    color: theme.palette.text.primary
  },
  settingsBoxText: {
    color: theme.palette.secondary.main,
    fontWeight: 500
  }
}))


export default function CCASettingsHome() {
  const classes = useStyles()
  const image = 'https://images.vexels.com/media/users/3/148166/isolated/preview/488f0787445ac3d5e112561829ec5467-abstract-orange-square-background-by-vexels.png'
  // const image = 'https://img.freepik.com/free-vector/abstract-colorful-transparent-polygonal-background_1055-5149.jpg?size=338&ext=jpg'
  function SettingsLinkBox({text, bgImage, link, icon}){
    return(
      <Grid item>
          <Link to={link} style={{ textDecoration: 'none' }}>
            <Card style={{
              width: 150,
              height: 90,
              border: 30,
              padding: 40,
              margin: 15,
              borderRadius: '10%',
              backgroundImage:bgImage,
              backgroundPosition:'50%',
            }}
            > 
            <Box color="secondary.main" style={{ fontSize: 34 }} clone>
              {icon}
            </Box>
            
            <Typography variant='h5' className={classes.settingsBoxText}>
              {text}
            </Typography>
            </Card>
          </Link>
      </Grid>
    )    
  }

  return (
    <Container >
      <Typography variant="h4" className={classes.ccaSettingsTitle}>
        <Box fontWeight={700} textAlign="center">
          CCA Settings
        </Box>
      </Typography>
      
      <Grid container direction="row" justify="center" alignItems="center">

        <SettingsLinkBox 
        text="CCA Accounts" 
        bgImage={`linear-gradient(to bottom, #13b5a080, #06bc8e), url(${image})`}
        link="/cca-panel"
        icon={<PersonIcon/>}
        />

        <SettingsLinkBox 
        text="Society Accounts" 
        link="/society-panel"
        bgImage={`linear-gradient(to bottom, #148a7780, #148a77),url(${image})`}

        icon={<PeopleAltIcon/>}
        />  

        <SettingsLinkBox 
        text="Departments" 
        link="/department-panel"
        bgImage={`linear-gradient(to bottom, #06bc8e80, #06bc8e),url(${image})`}
        icon={<BusinessIcon/>}
        />

        <SettingsLinkBox 
        text="Department Members" 
        link="/duser-panel"
        bgImage={`linear-gradient(to bottom, #148a7780, #148a77),url(${image})`}
        icon={<AssignmentIndIcon/>}
        />
      </Grid>

      <Grid container direction="row" justify="center" alignItems="center">

        <SettingsLinkBox 
        text="Sponsor Categories" 
        link="/category-panel"
        bgImage={`linear-gradient(to bottom, #06bc8e80, #06bc8e),url(${image})`}
        icon={<MonetizationOnIcon/>}
        /> 

        <SettingsLinkBox 
        text="Sponsor Mileages" 
        link="/mileage-panel"
        bgImage={`linear-gradient(to bottom, #148a7780, #148a77),url(${image})`}
        icon={<CheckCircleIcon/>}
        />

        <SettingsLinkBox 
        text="Change Password" 
        link="/change-password"
        bgImage={`linear-gradient(to bottom, #06bc8e80, #06bc8e),url(${image})`}
        icon={<LockIcon/>}
        />
        
      
      </Grid>
      
    </Container>
  )
}