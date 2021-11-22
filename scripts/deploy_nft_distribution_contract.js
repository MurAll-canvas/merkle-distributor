const prompt = require('prompt-sync')()

async function main () {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying staking contract with guild using the account:', await deployer.getAddress())

  const tokenAddress = prompt('ERC1155 address? ')
  const merkleRoot = prompt('Merkle root? ') // copy from generated json

  console.log('ERC1155 address:', tokenAddress)
  console.log('\nMerkle root:', merkleRoot)

  prompt('If happy, hit enter...')

  const MerkleDistributorFactory = await ethers.getContractFactory('MerkleErc1155Distributor')

  const merkleDistributorInstance = await MerkleDistributorFactory.deploy(tokenAddress, merkleRoot)

  await merkleDistributorInstance.deployed()

  console.log('Claim contract deployed at', merkleDistributorInstance.address)

  console.log('Finished!')
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
