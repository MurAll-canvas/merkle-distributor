const prompt = require('prompt-sync')()
const ERC20Metadata = require('../artifacts/contracts/test/TestERC20.sol/TestERC20.json')

async function main () {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying staking contract with guild using the account:', await deployer.getAddress())

  const tokenAddress = prompt('Token address? ') 
  const merkleRoot = prompt('Merkle root? ') // copy from generated json
  const maxTokens = prompt('Max tokens? ') // copy from generated json
  const timelockDays = prompt('Timelock days? ')

  const tokenInstance = new ethers.Contract(tokenAddress, ERC20Metadata.abi, deployer)
  const decimals = await tokenInstance.decimals()
  const symbol = await tokenInstance.symbol()
  console.log('\nToken address:', tokenAddress)
  console.log('\nToken symbol: ', symbol)
  console.log('\nToken decimals: ', decimals)

  console.log('\nMerkle root:', merkleRoot)
  console.log('\nMax tokens formatted:', ethers.utils.formatUnits(maxTokens, decimals).toString() + ' ' + symbol)

  prompt('If happy, hit enter...')

  const MerkleDistributorFactory = await ethers.getContractFactory('MerkleDistributor')

  const merkleDistributorInstance = await MerkleDistributorFactory.deploy(tokenAddress, merkleRoot, timelockDays)

  await merkleDistributorInstance.deployed()
  const deployedAddress = merkleDistributorInstance.address

  console.log('Claim contract deployed at', deployedAddress)

  console.log('About to send amount of tokens to claim contract:', ethers.BigNumber.from(maxTokens).toString())

  prompt('\nIf happy, hit enter...\n')

  const deployerAddress = await deployer.getAddress()
  console.log('\nMoving tokens from ' + deployerAddress + ' to ' + deployedAddress)
  const tx = await tokenInstance.transfer(deployedAddress, maxTokens)
  await tx.wait()

  console.log('Done!')

  console.log('Finished!')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
