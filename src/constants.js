const clientConfig = {
    mnemonic: process.env.VUE_APP_PROTOTYPE_BR_KEY,
    nodeUrl: 'wss://rinkeby.indra.connext.network/api/messaging',
    ethProviderUrl: `https://rinkeby.indra.connext.network/api/ethprovider`
};

export {
    clientConfig
};
