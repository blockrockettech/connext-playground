console.log(process.env);

const clientConfig = {
    mnemonic: process.env.VUE_APP_SENDER_KEY,
    nodeUrl: 'wss://staging.indra.connext.network/api/messaging',
    ethProviderUrl: `https://rinkeby.indra.connext.network/api/ethprovider`
};

export {
    clientConfig
};
