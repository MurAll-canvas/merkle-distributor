import { BigNumber, utils } from 'ethers'
import BalanceErc1155Tree from './balance-erc1155-tree'

const { isAddress, getAddress } = utils

// This is the blob that gets distributed and pinned to IPFS.
// It is completely sufficient for recreating the entire merkle tree.
// Anyone can verify that all air drops are included in the tree,
// and the tree has no additional distributions.
interface MerkleDistributorInfo {
  merkleRoot: string
  tokenTotals: { [tokenId: string]: string }
  claims: {
    [account: string]: {
      index: number
      amount: string
      tokenId: string
      proof: string[]
    }
  }
}

type NewFormat = { address: string; tokenId: string; amount: string }

export function parseBalanceMap (balances: NewFormat[]): MerkleDistributorInfo {
  // if balances are in an old format, process them
  const balancesInNewFormat: NewFormat[] = balances

  const dataByAddress = balancesInNewFormat.reduce<{
    [address: string]: { tokenId: BigNumber; amount: BigNumber }
  }>((memo, { address: account, tokenId, amount }) => {
    if (!isAddress(account)) {
      throw new Error(`Found invalid address: ${account}`)
    }
    const parsed = getAddress(account)
    if (memo[parsed]) throw new Error(`Duplicate address: ${parsed}`)
    const parsedNum = BigNumber.from(amount)
    const parsedTokenId = BigNumber.from(tokenId)
    if (parsedNum.lte(0)) throw new Error(`Invalid amount for account: ${account}`)

    memo[parsed] = { tokenId: parsedTokenId, amount: parsedNum }
    return memo
  }, {})

  const sortedAddresses = Object.keys(dataByAddress).sort()

  // construct a tree
  const tree = new BalanceErc1155Tree(
    sortedAddresses.map(address => ({
      account: address,
      tokenId: dataByAddress[address].tokenId,
      amount: dataByAddress[address].amount
    }))
  )

  // generate claims
  const claims = sortedAddresses.reduce<{
    [address: string]: { amount: string; tokenId: string; index: number; proof: string[] }
  }>((memo, address, index) => {
    const { tokenId, amount } = dataByAddress[address]
    memo[address] = {
      index,
      amount: amount.toHexString(),
      tokenId: tokenId.toHexString(),
      proof: tree.getProof(index, address, tokenId, amount)
    }
    return memo
  }, {})

  const tokenTotals = sortedAddresses.reduce<{
    [tokenId: string]: string
  }>((memo, address, index) => {
    const { tokenId, amount } = dataByAddress[address]

    if (!memo[tokenId.toHexString()]) memo[tokenId.toHexString()] = '0x0'
    memo[tokenId.toHexString()] = BigNumber.from(memo[tokenId.toHexString()])
      .add(amount)
      .toHexString()
    return memo
  }, {})

  return {
    merkleRoot: tree.getHexRoot(),
    tokenTotals: tokenTotals,
    claims
  }
}
