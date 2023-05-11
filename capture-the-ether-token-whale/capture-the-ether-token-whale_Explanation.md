# Token Whale Challenge

The Token Whale Challenge highlights a vulnerability in the ERC20 token implementation, specifically within the `transferFrom()` and `_transfer()` functions. The challenge starts with a total supply of 1,000 tokens, all owned by the player, and the goal is to exploit the vulnerability to acquire at least 1,000,000 tokens.

The problem comes from two functions: `approve()` and `_transfer()`. `approve()` lets users approve more tokens than they have, while `_transfer()` doesn't check if the person sending the tokens has enough to send.

The potential vulnerability in the provided code lies in the `_transfer` function. This function is designed to move tokens from one account to another. However, the source of the tokens is always `msg.sender`, rather than the `from` parameter that is passed into the `transferFrom` function.

```solidity
function _transfer(address to, uint256 value) internal {
    balanceOf[msg.sender] -= value;
    balanceOf[to] += value;

    emit Transfer(msg.sender, to, value);
}
```

## Exploiting the Vulnerability

Follow these steps:

1. Use the `approve()` function from the player's address to grant a large token allowance to another address.
2. Execute the `transferFrom()` function from the second address, transferring a small number of tokens to a third address.
3. The `_transfer()` function causes the second address's balance to underflow, resulting in a substantial token balance.
4. Transfer the required number of tokens from the second address back to the player's address.

## Fixing the Vulnerability

To fix this vulnerability, verify the token owner's balance in the `approve()` function and check the sender's allowance and balance in the `_transfer()` function to prevent overflows and underflows.
