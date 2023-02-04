// ** MUI Imports

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography'
import Box from "@mui/material/Box";
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip';
import CardContent from '@mui/material/CardContent'
import CircularProgress from "@mui/material/CircularProgress";
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import HoneypotCheckerCaller from 'src/api/HoneypotCheckerCaller';
import Web3 from 'web3';
const {
  RPC,
  PANCAKE_SWAP_ROUTER_ADDRESS,
  WBNB_ADDRESS,
  HONEYPOT_CHECKER_ADDRESS,
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

    if (dexscreener.data) {

      const pusd = Number(dexscreener.data.pairs[0].priceUsd);
      const pnat = Number(dexscreener.data.pairs[0].priceNative)

      const quotePrice =2*pusd/pnat;

      const liquidityinQuote = Number(dexscreener.data.pairs[0].liquidity.usd)/quotePrice;

      const chainId = dexscreener.data.pairs[0].chainId;
      const dexId = dexscreener.data.pairs[0].dexId;
      const name = dexscreener.data.pairs[0].baseToken.name;
      const symbol = dexscreener.data.pairs[0].baseToken.symbol;
      const priceUsd = dexscreener.data.pairs[0].priceUsd;
      const liquidity = Number(liquidityinQuote).toFixed(2)+dexscreener.data.pairs[0].quoteToken.symbol+' ($'+Number(dexscreener.data.pairs[0].liquidity.usd).toFixed(2)/2+')';
      const pairCreatedAt = dexscreener.data.pairs[0].pairCreatedAt;
      const h1 = dexscreener.data.pairs[0].priceChange.h1;
      
      
      if (chainId === 'bsc') {

        const web3 = new Web3(RPC);
        const honeypotCheckerCaller = new HoneypotCheckerCaller(
          web3,
          HONEYPOT_CHECKER_ADDRESS
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
            const honeyPotCheck = checkforHoneyPot(response.data.result)?'FAILED':'PASSED';
            
            console.log('hpchecl '+ honeyPotCheck);
            setTokenInfo({
              name:name,
              symbol:symbol,
              network:String(chainId).toUpperCase(),
              dexId:String(dexId).toUpperCase(),
              h1:h1+' %',
              buygas:buyGas,
              sellgas:sellGas,
              buyTax:buyTax+' %',
              sellTax:sellTax+' %',
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
          </Paper> </CardContent>
      </Card>
      <Box>


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
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ pt: 3 }}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Chip color="primary" label={<h2> Information </h2>} sx={{ mt:5, mb:5,borderRadius: 10 }} />

              </Grid>

              <Grid item xs={2} sm={4} md={4} spacing={{ xs: 3, md: 5 }}>
                <Card sx={{ padding: 4 }}>
                  <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                    <Typography variant='button'><strong>Token Information</strong></Typography>
                  </Grid>
                  <Item tag='Name' value={tokenInfo.name} />
                  <Item tag='Symbol' value={tokenInfo.symbol} />
                  <Item tag='Network' value={tokenInfo.network} /> 
                  <Item tag='LP Pair' value={tokenInfo.dexId} />
                  <Item tag='Created At' value={tokenInfo.pairCreatedAt} />
                </Card>
              </Grid>
              <Grid item xs={2} sm={4} md={4} spacing={{ xs: 3, md: 5 }}>
                <Card sx={{ padding: 4 }}>
                  <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                    <Typography variant='button'><strong>HoneyPot Check</strong></Typography>
                  </Grid>
                  <Item tag='HoneyPot' value={tokenInfo.isHoneyPot} />
                  <Item tag='Buy Gas Limit' value={tokenInfo.buygas} />
                  <Item tag='Sell Gas Limit' value={tokenInfo.sellgas} />  
                  <Item tag='Token Verified' value={tokenInfo.verified?'Verified':'UnVerified'} />
                  <Item tag='Blacklisting' value={tokenInfo.blacklisted?'Enabled':'Not Found'} /> 
                </Card>
              </Grid>
              <Grid item xs={2} sm={4} md={4} spacing={{ xs: 3, md: 5 }}>
                <Card sx={{ padding: 4 }}>
                  <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                    <Typography variant='button'><strong>Pricing Information</strong></Typography>
                  </Grid>
                  <Item tag='Price' value={tokenInfo.priceUsd} />
                  <Item tag='Liquidity' value={tokenInfo.liquidity} />    
                  <Item tag='Buy Tax' value={tokenInfo.buyTax} />
                  <Item tag='Sell Tax' value={tokenInfo.sellTax} />
                  <Item tag='1h Change' value={tokenInfo.h1} /> 
                </Card>
              </Grid>
            </Grid> :
            ''
        }

      </Box>

    </Grid>
  )
}

export default Dashboard
