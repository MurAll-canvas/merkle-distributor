const prompt = require('prompt-sync')()

async function main () {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying erc721 contract using the account:', await deployer.getAddress())

  const tokenName = prompt('ERC721 name? ')
  const tokenSymbol = prompt('ERC721 symbol? ') // copy from generated json

  console.log('Name:', tokenName)
  console.log('\nSymbol:', tokenSymbol)

  prompt('If happy, hit enter...')

  const Erc721Factory = await ethers.getContractFactory('FUSoulboundErc721')

  const erc721Instance = await Erc721Factory.deploy(tokenName, tokenSymbol)

  await erc721Instance.deployed()

  console.log('Erc721 contract deployed at', erc721Instance.address)

  console.log('Finished!')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
