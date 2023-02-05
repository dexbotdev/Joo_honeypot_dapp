// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import { useTheme } from '@mui/material/styles'
 
import DotsVertical from 'mdi-material-ui/DotsVertical'  

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const series = [{ data: [0, 20, 5, 30, 15, 45] }]

const seriesSessions = [
  {
    name: '2023',
    data: [45, 85, 65, 50, 70]
  }
]

const TotalEarning = (props) => {
  const theme = useTheme()

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: false },
    grid: {
      strokeDashArray: 6,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -10,
        left: -7,
        right: 5,
        bottom: 5
      }
    },
    stroke: {
      width: 3,
      lineCap: 'butt',
      curve: 'straight'
    },
    colors: [theme.palette.primary.main],
    markers: {
      size: 6,
      offsetY: 4,
      offsetX: -2,
      strokeWidth: 3,
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: [
        {
          size: 5.5,
          seriesIndex: 0,
          strokeColor: theme.palette.primary.main,
          fillColor: theme.palette.background.paper,
          dataPointIndex: series[0].data.length - 1
        }
      ],
      hover: { size: 7 }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { show: false }
    }
  }

  const optionsSessions = {
    chart: {
      type: 'bar',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: {
      x: { show: false }
    },
    grid: {
      show: false,
      padding: {
        top: -10,
        left: -7,
        right: 0,
        bottom: 5
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.error.main,
      theme.palette.primary.main,
      theme.palette.error.main,
      theme.palette.primary.main,
      theme.palette.primary.main
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '20%',
        borderRadius: 4,
        startingShape: 'rounded',
        endingShape: 'rounded',
        distributed: true,
        colors: {
          backgroundBarRadius: 5,
          backgroundBarColors: [
            theme.palette.customColors.bodyBg,
            theme.palette.customColors.bodyBg,
            theme.palette.customColors.bodyBg,
            theme.palette.customColors.bodyBg,
            theme.palette.customColors.bodyBg
          ]
        }
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false }
  }
  return (
    <Card>
      <CardHeader
        title='Price Information'
        titleTypographyProps={{ sx: { lineHeight: '0.6 !important', letterSpacing: '0.15px !important' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent >
        <h5>Price</h5>
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
            <ReactApexcharts type='line' height={98} options={options} series={series} />
         </Box>
 
        <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', color: 'text.primary' }}>
          Current Price {props.data.priceUsd}
        </Typography>
 
      </CardContent>
      <CardContent >
        <h5>Liquidity</h5> 
        <ReactApexcharts type='bar' height={98} options={optionsSessions} series={seriesSessions} />
        <Typography variant='body2' sx={{ fontWeight: 600, textAlign: 'center', color: 'text.primary' }}>
        {props.data.liquidity}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default TotalEarning
