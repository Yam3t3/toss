contractAddress = '0xDDC3e711B38476102948E094a9A1e79b4D8eA83e',
abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'r',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'message',
        type: 'string'
      }
    ],
    name: 'Result',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract IERC20',
        name: 'token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'TokenTransferred',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'add',
        type: 'address'
      }
    ],
    name: 'getDATBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTokenValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getWinValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'play',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'new_DAT_address',
        type: 'address'
      }
    ],
    name: 'setDATaddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'new_token_value',
        type: 'uint256'
      }
    ],
    name: 'setTokenValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'new_value',
        type: 'uint256'
      }
    ],
    name: 'setValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'new_win_value',
        type: 'uint256'
      }
    ],
    name: 'setWinValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'withdrawDAT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    stateMutability: 'payable',
    type: 'receive'
  }
]

async function checkChain () {
  const targetNetworkId = '0x1ed816'
  const currentChainId = await window.ethereum.request({
	      method: 'eth_chainId'
	    })
  if (currentChainId != targetNetworkId) {
	  document.getElementById('chain').hidden = false
  } else {
	  document.getElementById('chain').hidden = true
	  document.getElementById('mint').hidden = false
	  this.getValues() 
	  this.getDATBalance()
  }
}

async function changeChain () {
  const targetNetworkId = '0x1ed816'
  await window.ethereum.request({
	  method: 'wallet_switchEthereumChain',
	  params: [{ chainId: targetNetworkId }]
  })
  this.checkChain()
}

async function play () {
  const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider())
  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, abi, signer)
  const options = { value: ethers.utils.parseEther('0.001'), gasLimit: 33000 }
  const res = await contract.play(options)
  const a = document.createElement('a')
  a.title = 'Waiting for tx'
  a.target = 'about:blank'
  a.href = `https://explorer.testnet.debank.com/tx/${res.hash}`
  a.replaceChildren('Waiting for transaction to confirm... ⧉')
  document.getElementById('event').classList = 'alert alert-info alert-dismissible fade show'
  document.getElementById('event').replaceChildren(a)
  // res.wait();
}

async function getResult () {
  const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider())
  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  provider.pollingInterval = 500
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, abi, signer)
  contract.on('Result', (r, message) => {
	  console.log(message)
	  document.getElementById('event').classList = 'alert alert-info alert-dismissible fade show'
	  document.getElementById('event').replaceChildren(message)
	  this.getDATBalance();
  })
}

async function getDATTransaction () {
  const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider())
  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  provider.pollingInterval = 500
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, abi, signer)
  contract.on('TokenTransferred', (token, sender, amount) => {
	  document.getElementById('event').classList = 'alert alert-info alert-dismissible fade show'
	  document.getElementById('event').replaceChildren("DAT token transferred !")
	  this.getDATBalance();
  })
}

async function getValues() {
  const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());
  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', []);
  provider.pollingInterval = 500;
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const playValue = await contract.getValue();
  const winValue = await contract.getWinValue();
  const tokenValue = await contract.getTokenValue();
  var plv = document.getElementsByClassName('play-value');
  Array.from(plv).forEach(element => {
    element.replaceChildren(playValue/(10**18));
  });
  document.getElementById('win-value').replaceChildren(winValue/(10**18));
  document.getElementById('dat-value').replaceChildren(tokenValue/(10**18));
}


async function getDATBalance() {
  const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());
  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', []);
  provider.pollingInterval = 500;
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const balances = await contract.getDATBalance(signer.getAddress());
  if (balances != 0) {
    document.getElementById('dat-balances').replaceChildren(balances/(10**18));
    document.getElementById('dat').hidden = false;
  }
}

async function withdrawDAT() {
  const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider())
  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, abi, signer)
  const options = { gasLimit: 400000 }
  const res = await contract.withdrawDAT(options)
  const a = document.createElement('a')
  a.title = 'Waiting for tx'
  a.target = 'about:blank'
  a.href = `https://explorer.testnet.debank.com/tx/${res.hash}`
  a.replaceChildren('Waiting for transaction to confirm... ⧉')
  document.getElementById('event').classList = 'alert alert-info alert-dismissible fade show'
  document.getElementById('event').replaceChildren(a)
  // res.wait();
}


getResult();
getDATTransaction();
