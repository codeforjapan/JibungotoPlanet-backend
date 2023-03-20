import { ethers } from 'ethers'
import Web3 from 'web3'
const ActionHistoryAbi = require('./abi/ActionHistory.json')

const web3 = new Web3(
  'wss://polygon-mumbai.g.alchemy.com/v2/vGk7cESxzLL6yamDolkrzFBLRDHm-G10'
)

const main = async () => {
  const networkId = await web3.eth.net.getId()

  const contract = new web3.eth.Contract(
    ActionHistoryAbi.abi,
    '0x260b4E0400ca14597dc45c9563824D7B94a5E759'
  )

  web3.eth.accounts.wallet.add(
    '8459d60418aa2ac4fbae555d5105d571a3cd0f4cd2523b96d12b8e028a9eb13c'
  )

  const metadata = {
    answerAll: true,
    housing: 100,
    food: 100,
    mobility: 100,
    other: 100
  }
  const encodedParam = web3.eth.abi.encodeParameter(
    {
      RequiredMetadata: {
        answerAll: 'bool',
        housing: 'uint8',
        food: 'uint8',
        mobility: 'uint8',
        other: 'uint8'
      }
    },
    metadata
  )

  const tx = contract.methods.register({
    owner: '0xdCb93093424447bF4FE9Df869750950922F1E30B',
    secretary: '0xddcebb70E57808dB8825B8857F96E12985F7754f',
    actionId: 1,
    standardMetadata: encodedParam,
    optionalMetadata: '',
    status: 1
  })

  const gas = await tx.estimateGas({
    from: '0xddcebb70E57808dB8825B8857F96E12985F7754f'
  })
  const gasPrice = Number(await web3.eth.getGasPrice())
  const data = tx.encodeABI()
  const nonce = await web3.eth.getTransactionCount(
    '0xddcebb70E57808dB8825B8857F96E12985F7754f'
  )

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: contract.options.address,
      data,
      gas,
      gasPrice,
      nonce,
      chainId: networkId
    },
    '8459d60418aa2ac4fbae555d5105d571a3cd0f4cd2523b96d12b8e028a9eb13c'
  )

  await web3.eth.sendSignedTransaction(signedTx.rawTransaction || '')
  return
}

main().catch((err) => {
  console.log(err)
  return
})
