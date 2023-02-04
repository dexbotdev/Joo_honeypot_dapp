// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

const salesData = [
  {
    stats: '245k',
    title: 'Sales',
    color: 'primary',
    icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '12.5k',
    title: 'Customers',
    color: 'success',
    icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '1.54k',
    color: 'warning',
    title: 'Products',
    icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '$88k',
    color: 'info',
    title: 'Revenue',
    icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
  }
]

const renderStats = () => {
  return salesData.map((item, index) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const StatisticsCard = (props) => {
  return (
    <Card>
      <CardHeader
        title='Security Checks'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'cyan' }}>
              Price  changed {props.data.h1} % in last  1 Hour
            </Box>
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          <Grid item xs={12} sm={3} key={0}>
            <Box key={0} sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: 'common.white',
                  backgroundColor: `primary.main`
                }}
              >
                <AccountOutline sx={{ fontSize: '1.75rem' }} />
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>HoneyPot</Typography>
                <Typography variant='h6'>{props.data.isHoneyPot}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} key={0}>
            <Box key={0} sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: 'common.white',
                  backgroundColor: `success.main`
                }}
              >
               <CellphoneLink sx={{ fontSize: '1.75rem' }} />
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Blacklist</Typography>
                <Typography variant='h6'>{props.data.blacklisted?'Enabled':'Not Found'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} key={0}>
            <Box key={0} sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: 'common.white',
                  backgroundColor: `danger.main`
                }}
              >
                <TrendingUp sx={{ fontSize: '1.75rem' }} />
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Verified</Typography>
                <Typography variant='h6'>{props.data.verified?'Verified':'UnVerified'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} key={0}>
            <Box key={0} sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: 'common.white',
                  backgroundColor: `info.main`
                }}
              >
               <CellphoneLink sx={{ fontSize: '1.75rem' }} />
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>Tax Range</Typography>
                <Typography variant='h6'>{props.data.buyTax>10?' High ':' Low'}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
