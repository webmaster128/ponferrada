import { TokenTicker, PublicIdentity } from '@iov/bcp';
import { TransactionEncoder, GetIdentitiesAuthorization, SignAndPostAuthorization } from '@iov/core';
import { EnglishMnemonic } from '@iov/crypto';

import { Persona } from './persona';
import { withChainsDescribe } from '../../utils/test/testExecutor';

withChainsDescribe('Persona', () => {
  const revealAllIdentities: GetIdentitiesAuthorization = async (
    reason,
    matchingIdentities
  ): Promise<ReadonlyArray<PublicIdentity>> => {
    return matchingIdentities;
  };
  const signEverything: SignAndPostAuthorization = async (): Promise<boolean> => {
    return true;
  };

  describe('create', () => {
    it('can be created', async () => {
      const persona = await Persona.create();
      expect(persona).toBeTruthy();
      persona.destroy();
    });
  });

  describe('mnemonic', () => {
    it('returns a mnemonic', async () => {
      const persona = await Persona.create();

      expect(() => {
        // this constructor throws when the mnemonic string is not valid
        new EnglishMnemonic(persona.mnemonic);
      }).not.toThrow();

      persona.destroy();
    });

    it('returns the right mnemonic', async () => {
      const presetMnemonic = 'until apple post diamond casual bridge bird solid inform size prize debris';
      const persona = await Persona.create(presetMnemonic);

      expect(persona.mnemonic).toEqual(presetMnemonic);

      persona.destroy();
    });
  });

  describe('getAccounts', () => {
    it('can get accounts', async () => {
      const persona = await Persona.create();

      const accounts = await persona.getAccounts();
      expect(accounts.length).toEqual(1);

      expect(accounts[0].name).toEqual('Account 0');
      expect(accounts[0].identities.length).toEqual(4);

      persona.destroy();
    });
  });

  describe('getBalances', () => {
    it('can get balances of first account', async () => {
      const persona = await Persona.create();

      const balances = await persona.getBalances(0);
      // no address exists on chain, so balance exists
      expect(balances.length).toEqual(0);

      persona.destroy();
    });

    it('gets proper balance for Ethereum account', async () => {
      const persona = await Persona.create(
        'oxygen fall sure lava energy veteran enroll frown question detail include maximum'
      );

      const balances = await persona.getBalances(0);
      const ethBalance = balances.find(b => b.tokenTicker === ('ETH' as TokenTicker));
      if (!ethBalance) {
        throw new Error('Did not find an ETH balance');
      }
      const approxEther = Number.parseInt(ethBalance.quantity, 10) / 1e18;

      expect(approxEther).toBeCloseTo(100, -1);

      persona.destroy();
    });

    it('throws when calling for non-existing account', async () => {
      const persona = await Persona.create();
      await expect(persona.getBalances(42)).rejects.toThrowError(/account does not exist/i);
      persona.destroy();
    });
  });

  describe('startSigningServer', () => {
    it('can start the signing server', async () => {
      const persona = await Persona.create();
      const server = persona.startSigningServer(revealAllIdentities, signEverything);
      expect(server).toBeTruthy();
      persona.destroy();
    });

    it('can send example request to the signing server', async () => {
      const persona = await Persona.create(
        'oxygen fall sure lava energy veteran enroll frown question detail include maximum'
      );
      const server = persona.startSigningServer(revealAllIdentities, signEverything);
      const response = await server.handleChecked({
        jsonrpc: '2.0',
        id: 1,
        method: 'getIdentities',
        params: {
          reason: TransactionEncoder.toJson('I would like to know who you are on Ethereum'),
          chainIds: TransactionEncoder.toJson(['ethereum-eip155-5777']),
        },
      });
      expect(response).toEqual({
        jsonrpc: '2.0',
        id: 1,
        result: [
          {
            chainId: 'string:ethereum-eip155-5777',
            pubkey: {
              algo: 'string:secp256k1',
              data:
                'bytes:04965fb72aad79318cd8c8c975cf18fa8bcac0c091605d10e89cd5a9f7cff564b0cb0459a7c22903119f7a42947c32c1cc6a434a86f0e26aad00ca2b2aff6ba381',
            },
          },
        ],
      });
      persona.destroy();
    });
  });

  describe('tearDownSigningServer', () => {
    it('can tear down the signing server', async () => {
      const persona = await Persona.create();

      expect(() => {
        persona.startSigningServer(revealAllIdentities, signEverything);
        persona.tearDownSigningServer();
      }).not.toThrow();

      persona.destroy();
    });
  });
});
