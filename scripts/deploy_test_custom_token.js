const prompt = require('prompt-sync')()

async function main () {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying Mock token with the account:', await deployer.getAddress())

  const name = prompt('Name? ')
  const symbol = prompt('Symbol? ')
  const decimals = prompt('Decimals? ')
  const initialSupply = prompt('Initial supply? ')

  const initialSupplyRecipient = await deployer.getAddress()

  console.log('\nName', name)
  console.log('\nSymbol', symbol)
  console.log('\nDecimals', decimals)
  console.log('\nInitial supply', initialSupply)
  console.log('\nInitial supply recipient', initialSupplyRecipient)

  prompt('If happy, hit enter...')

  const MockCustomDecimalERC20Factory = await ethers.getContractFactory('MockCustomDecimalERC20')

  const token = await MockCustomDecimalERC20Factory.deploy(name, symbol, initialSupply, decimals)

  await token.deployed()

  console.log('Token deployed at', token.address)

  console.log('Finished!')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
