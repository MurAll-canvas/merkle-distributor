import MerkleTree from './merkle-tree'
import { BigNumber, utils } from 'ethers'

export default class BalanceErc1155Tree {
  private readonly tree: MerkleTree
  constructor (balances: { account: string; tokenId: BigNumber; amount: BigNumber }[]) {
    this.tree = new MerkleTree(
      balances.map(({ account, tokenId, amount }, index) => {
        return BalanceErc1155Tree.toNode(index, account, tokenId, amount)
      })
    )
  }

  public static verifyProof (
    index: number | BigNumber,
    account: string,
    tokenId: BigNumber,
    amount: BigNumber,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    let pair = BalanceErc1155Tree.toNode(index, account, tokenId, amount)
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item)
    }

    return pair.equals(root)
  }

  // keccak256(abi.encode(index, account, amount))
  public static toNode (index: number | BigNumber, account: string, tokenId: BigNumber, amount: BigNumber): Buffer {
    return Buffer.from(
      utils
        .solidityKeccak256(['uint256', 'address', 'uint256', 'uint256'], [index, account, tokenId, amount])
        .substr(2),
      'hex'
    )
  }

  public getHexRoot (): string {
    return this.tree.getHexRoot()
  }

  // returns the hex bytes32 values of the proof
  public getProof (index: number | BigNumber, account: string, tokenId: BigNumber, amount: BigNumber): string[] {
    return this.tree.getHexProof(BalanceErc1155Tree.toNode(index, account, tokenId, amount))
  }
}
