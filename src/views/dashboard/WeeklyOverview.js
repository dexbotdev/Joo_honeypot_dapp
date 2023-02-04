// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const WeeklyOverview = (props) => {
  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      padding: {
        top: -1,
        right: 0,
        left: -12,
        bottom: 5
      }
    },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.background.default,
      theme.palette.background.default,
      theme.palette.background.default,
      theme.palette.primary.main,
      theme.palette.background.default,
      theme.palette.background.default
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tickPlacement: 'on',
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetX: -17,
        formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`
      }
    }
  }
  const Item = (props) => {
    let colorTxt='cyan';
    if(props.value === 'FAILED' || props.value === 'UnVerified' || Number(props.value)<0)
    colorTxt='red'
  
    return (<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
      <Typography variant='body2' sx={{ color: 'common.grey', fontWeight: 'bolder' }}>
        {props.tag}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
        <Typography variant='button' sx={{ color: colorTxt, fontWeight: 'bolder' }}>
          {props.value}
        </Typography>
      </Box>
    </Box>
  </Box>)};
  return (
    <Card>
      <CardHeader
        title='Token Information'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
      <Item tag='Name' value={props.data.name} />
                  <Item tag='Symbol' value={props.data.symbol} />
                  <Item tag='Network' value={props.data.network} /> 
                  <Item tag='LP Pair' value={props.data.dexId} />
                  <Item tag='Created At' value={props.data.pairCreatedAt} />
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview
