import Vue from 'vue';
import Vuex from 'vuex';
import * as connext from '@connext/client';
import * as ethers from 'ethers';

import {clientConfig} from './constants';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {
        setConnextChannel(state, channel) {
            state.channel = channel;
        },
    },
    actions: {
        async initConnextChannel({commit, dispatch, state}) {
            const channel = await connext.connect({
                ...clientConfig,
                store: {
                    // FIXME migrate to vuex action
                    get(path) {
                        const raw = localStorage.getItem(`CF_NODE:${path}`);
                        if (raw) {
                            try {
                                return JSON.parse(raw);
                            } catch {
                                return raw;
                            }
                        }
                        // Handle partial matches so the following line works -.-
                        // https://github.com/counterfactual/monorepo/blob/master/packages/node/src/store.ts#L54
                        if (path.endsWith('channel') || path.endsWith('appInstanceIdToProposedAppInstance')) {
                            const partialMatches = {};
                            for (const k of Object.keys(localStorage)) {
                                if (k.includes(`${path}/`)) {
                                    try {
                                        partialMatches[k.replace('CF_NODE:', '').replace(`${path}/`, '')] = JSON.parse(localStorage.getItem(k));
                                    } catch {
                                        partialMatches[k.replace('CF_NODE:', '').replace(`${path}/`, '')] = localStorage.getItem(k);
                                    }
                                }
                            }
                            return partialMatches;
                        }
                        return raw;
                    },
                    // FIXME migrate to vuex mutation
                    set(pairs, allowDelete) {
                        for (const pair of pairs) {
                            localStorage.setItem(
                                `CF_NODE:${pair.path}`,
                                typeof pair.value === 'string' ? pair.value : JSON.stringify(pair.value),
                            );
                        }
                    }
                }
            });
            commit('setConnextChannel', channel);
        },
        connect({commit, dispatch, state}) {

        },
        async deposit({commit, dispatch, state}) {
            // // Making a deposit in ETH

            return state.channel.deposit({
                amount: '0x3abc', // represented as bignumber
                assetId: ethers.constants.AddressZero // Use the AddressZero constant from ethers.js to represent ETH, or enter the token address
            });
        },
        async exchange({commit, dispatch, state}) {
            // Exchanging Wei for Dai
            await state.channel.exchange({
                amount: '0x3abc', // in Wei, represented as bignumber
                toAssetId: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', // Dai
                fromAssetId: ethers.constants.AddressZero // ETH
            });
        }
    }
});
