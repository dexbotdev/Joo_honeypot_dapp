// ** MUI Imports

import React, { useState, useEffect, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'
// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import Typography from '@mui/material/Typography'
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip';
import CardContent from '@mui/material/CardContent'
import CircularProgress from "@mui/material/CircularProgress";
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import HoneypotCheckerCaller from 'src/api/HoneypotCheckerCaller';
import Web3 from 'web3';
const {
  RPC_BSC,
  PANCAKE_SWAP_ROUTER_ADDRESS,
  WBNB_ADDRESS,
  HONEYPOT_CHECKER_ADDRESS_BSC,
  RPC_MATIC,
  UNISWAP_ROUTER_ADDRESSV3,
  MATIC_ADDRESS,
  HONEYPOT_CHECKER_ADDRESS_MATIC,
  RPC_ETH,
  UNISWAP_ROUTER_ADDRESS,
  WETH_ADDRESS,
  HONEYPOT_CHECKER_ADDRESS_ETH,
} = require("src/constants")("MAINNET");

const { bep20Abi } = require("src/ABI");


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

const Dashboard = () => {

  const [network, setNetwork] = React.useState('');
  const [tokenAddress, setTokenAddress] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false)
  const [tokenInfo,setTokenInfo] = useState({});

  const handleClose = () => {
    setIsLoading(false);
  };

  const checkforHoneyPot =(abi)=>{

    console.log(abi);
    var str = JSON.stringify(abi).toLowerCase();

    const isAccounting = str.indexOf('accounting')>0;
    const isLibrary = str.indexOf('library')>0;
    const isBlackList = str.indexOf('blacklist')>0;

    console.log(str);
    console.log(isAccounting);
    console.log(isLibrary);
    console.log(isBlackList);

    if(isAccounting ) return true;
    else if(isBlackList) return true;
    else if(isLibrary) return true;

    return false;

  }
  const fetchTokenDetails=()=>{
      if(tokenAddress != undefined){
        getTokenDetails(tokenAddress)
      } else {
        alert('Enter Token Address')
      }
  }

  const getTokenDetails = async (tokenAddress) => {

    setIsLoading(true);
    setTokenInfo({});
    const dexscreener = await axios
      .get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`)
      .then((res) => res)
      .catch((err) => null);

      console.log(dexscreener.data);

      if(dexscreener.data.pairs[0].chainId === 'bsc') console.log('******************* its BSC');

    if (dexscreener.data) {

      const pusd = Number(dexscreener.data.pairs[0].priceUsd);
      const pnat = Number(dexscreener.data.pairs[0].priceNative)

      const quotePrice =2*pusd/pnat;

      let liquidityinQuote = 0;
      let liquiditys = 0;
      if(dexscreener.data.pairs[0]?.liquidity)
      {
        liquidityinQuote=Number(dexscreener.data.pairs[0]?.liquidity?.usd)/quotePrice;
        liquiditys=Number(dexscreener.data.pairs[0]?.liquidity?.usd);
    }

      const chainId = dexscreener.data.pairs[0].chainId;
      const dexId = dexscreener.data.pairs[0].dexId;
      const name = dexscreener.data.pairs[0].baseToken.name;
      const symbol = dexscreener.data.pairs[0].baseToken.symbol;
      const priceUsd = dexscreener.data.pairs[0].priceUsd;
      const liquidity = Number(liquidityinQuote).toFixed(2)+dexscreener.data.pairs[0].quoteToken.symbol+' ($'+liquiditys.toFixed(2)/2+')';
      const pairCreatedAt = dexscreener.data.pairs[0].pairCreatedAt;
      const h1 = dexscreener.data.pairs[0].priceChange.h1;
      
      
      if (chainId === 'bsc') {


        console.log('******************* its BSC');

        const web3 = new Web3(new Web3.providers.HttpProvider(RPC_BSC));
        const honeypotCheckerCaller = new HoneypotCheckerCaller(
          web3,
          HONEYPOT_CHECKER_ADDRESS_BSC
        )

        const {
          buyGas,
          sellGas,
          estimatedBuy,
          exactBuy,
          estimatedSell,
          exactSell,
        } = await honeypotCheckerCaller.check(PANCAKE_SWAP_ROUTER_ADDRESS, [
          WBNB_ADDRESS,
          tokenAddress,
        ]);

        console.log('******************* its BSC '+buyGas);

        const [buyTax, sellTax] = [
          honeypotCheckerCaller.calculateTaxFee(estimatedBuy, exactBuy),
          honeypotCheckerCaller.calculateTaxFee(estimatedSell, exactSell),
        ]; 
         

        let verified=false;
        let honeyPotCheck=false;
        const verificationdata = await axios
          .get(`https://api.bscscan.com/api?module=contract&action=getabi&address=${tokenAddress}&apikey=H8S7Y2FBEFSP2I5D1ZSTRR5DM6BDH9Q8SG`)
          .then((response)=>{
            if(response.data.status>0)verified=true;

            console.log(response.data);
            let honeyPotCheck = checkforHoneyPot(response.data.result)?'FAILED':'PASSED';
            
            if(buyGas === -1)honeyPotCheck='FAILED';

            console.log('hpchecl '+ honeyPotCheck);
            setTokenInfo({
              name:name,
              symbol:symbol,
              network:String(chainId).toUpperCase(),
              dexId:String(dexId).toUpperCase(),
              h1:h1,
              buygas:buyGas,
              sellgas:sellGas,
              buyTax:buyTax,
              sellTax:sellTax,
              liquidity:liquidity, 
              priceUsd:Number(priceUsd).toFixed(8)+' (in usd )', 
              pairCreatedAt:new Date(pairCreatedAt).toLocaleDateString(),
              isHoneyPot:honeyPotCheck, 
              verified:verified,
              blacklisted:!honeyPotCheck
            })
            setIsLoading(false);


          })
          .catch((err) => null);

          

        
      } else 
      if (chainId === 'ethereum') {
        const web3 = new Web3(new Web3.providers.HttpProvider(RPC_ETH)); 
        const honeypotCheckerCaller = new HoneypotCheckerCaller(
          web3,
          HONEYPOT_CHECKER_ADDRESS_ETH
        )

        const {
          buyGas,
          sellGas,
          estimatedBuy,
          exactBuy,
          estimatedSell,
          exactSell,
        } = await honeypotCheckerCaller.check(UNISWAP_ROUTER_ADDRESS, [
          WETH_ADDRESS,
          tokenAddress,
        ]);

        const [buyTax, sellTax] = [
          honeypotCheckerCaller.calculateTaxFee(estimatedBuy, exactBuy),
          honeypotCheckerCaller.calculateTaxFee(estimatedSell, exactSell),
        ]; 
         

        let verified=false;
        let honeyPotCheck=false;
        const verificationdata = await axios
          .get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}&apikey=CTMK2UQQ1GZZNQ1P6X5ZAX1BPB7YQVEQKS`)
          .then((response)=>{
            if(response.data.status>0)verified=true;

            console.log(response.data);
            let honeyPotCheck = checkforHoneyPot(response.data.result)?'FAILED':'PASSED';
            
            if(buyGas === -1)honeyPotCheck='FAILED';            
            console.log('hpchecl '+ honeyPotCheck);
            setTokenInfo({
              name:name,
              symbol:symbol,
              network:String(chainId).toUpperCase(),
              dexId:String(dexId).toUpperCase(),
              h1:h1,
              buygas:buyGas,
              sellgas:sellGas,
              buyTax:buyTax,
              sellTax:sellTax,
              liquidity:liquidity, 
              priceUsd:Number(priceUsd).toFixed(8)+' (in usd )', 
              pairCreatedAt:new Date(pairCreatedAt).toLocaleDateString(),
              isHoneyPot:honeyPotCheck, 
              verified:verified,
              blacklisted:!honeyPotCheck
            })
            setIsLoading(false);


          })
          .catch((err) => null);

          

        
      } else 
      if (chainId === 'polygon') {
        const web3 = new Web3(new Web3.providers.HttpProvider(RPC_MATIC));  

 
        const honeypotCheckerCaller = new HoneypotCheckerCaller(
          web3,
          HONEYPOT_CHECKER_ADDRESS_MATIC
        )

        const {
          buyGas,
          sellGas,
          estimatedBuy,
          exactBuy,
          estimatedSell,
          exactSell,
        } = await honeypotCheckerCaller.check(UNISWAP_ROUTER_ADDRESSV3, [
          MATIC_ADDRESS,
          tokenAddress,
        ]);

        const [buyTax, sellTax] = [
          honeypotCheckerCaller.calculateTaxFee(estimatedBuy, exactBuy),
          honeypotCheckerCaller.calculateTaxFee(estimatedSell, exactSell),
        ]; 
         

        let verified=false;
        let honeyPotCheck=false;
        const verificationdata = await axios
          .get(`https://api.polygonscan.com/api?module=contract&action=getabi&address=${tokenAddress}&apikey=GHAVAWYIQBVF4I5BAWECNV6TTE1QKXDNAH`)
          .then((response)=>{
            if(response.data.status>0)verified=true;

            console.log(response.data);
            let honeyPotCheck = checkforHoneyPot(response.data.result)?'FAILED':'PASSED';
            
            if(buyGas === -1)honeyPotCheck='FAILED';            
            console.log('hpchecl '+ honeyPotCheck);
            setTokenInfo({
              name:name,
              symbol:symbol,
              network:String(chainId).toUpperCase(),
              dexId:String(dexId).toUpperCase(),
              h1:h1,
              buygas:buyGas,
              sellgas:sellGas,
              buyTax:buyTax,
              sellTax:sellTax,
              liquidity:liquidity, 
              priceUsd:Number(priceUsd).toFixed(8)+' (in usd )', 
              pairCreatedAt:new Date(pairCreatedAt).toLocaleDateString(),
              isHoneyPot:honeyPotCheck, 
              verified:verified,
              blacklisted:!honeyPotCheck
            })
            setIsLoading(false);


          })
          .catch((err) => null);

          

        
      }
    }

    console.log(dexscreener.data.pairs[0]);
  }
  const handleChange = (event) => {
    setNetwork(event.target.value);
  };
  const handleInputChange = (event) => {
    setTokenAddress(event.target.value);
  };
 
  return (
    <Grid>
      <Grid item xs={12} sx={{ paddingBottom: 4 }}>
        <Typography variant='h5'>Scan Token</Typography>
      </Grid>
      <Card>
        <CardContent>
          <Paper sx={{ maxWidth: '100%', margin: 'auto', overflow: 'hidden' }}>
            <AppBar
              position="static"
              color="default"
              elevation={3}
            >
              <Toolbar>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <SearchIcon color="inherit" sx={{ display: 'block' }} />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      placeholder="Enter Token Address"
                      value={tokenAddress}
                      onChange={handleInputChange}
                      InputProps={{
                        disableUnderline: true,
                        sx: { fontSize: 'default' },
                      }}
                      variant="standard"
                    />
                  </Grid>
                  <Grid item> 
                    <Button variant="contained" sx={{ mr: 1 }} onClick={()=>{
                      fetchTokenDetails();
                    }}>
                      Scan Token
                    </Button>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
          </Paper> 
        </CardContent>
      </Card>
      {
          isLoading  ?
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
              onClick={handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop> :
            tokenInfo.symbol? 
      <ApexChartWrapper sx={{ mt: 4 }}>

      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy name={tokenInfo.name} priceusd={tokenInfo.priceUsd} network={tokenInfo.network}/>
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard data={tokenInfo}/>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <WeeklyOverview  data={tokenInfo}/>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TotalEarning  data={tokenInfo}/>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={tokenInfo.buygas}
                icon={<Poll />}
                color='success' 
                title='Buy Gas'
                subtitle='in wei'
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={tokenInfo.sellgas}
                title='Sell Gas'
                color='secondary' 
                subtitle='in wei'
                icon={<CurrencyUsd />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={tokenInfo.buyTax}
                trend='negative' 
                title='Buy Tax'
                subtitle='in pct'
                icon={<BriefcaseVariantOutline />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
               stats={tokenInfo.sellTax}
               trend='negative' 
               title='Sell Tax'
               subtitle='in pct'
                color='warning' 
                icon={<HelpCircleOutline />}
              />
            </Grid>
          </Grid>
        </Grid> 
      </Grid>
      </ApexChartWrapper> :'' }
       
    </Grid>
  )
}

export default Dashboard
