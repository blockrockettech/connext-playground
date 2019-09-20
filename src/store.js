import Vue from 'vue';
import Vuex from 'vuex';
import * as connext from '@connext/client';
import * as ethers from 'ethers';
import createLogger from 'vuex/dist/logger';

import {clientConfig} from './constants';

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createLogger()],
    state: {},
    mutations: {
        setConnextChannel(state, channel) {
            Vue.set(state, 'channel', channel);
        },
    },
    actions: {
        async getChannelProperty({commit, dispatch, state}, path) {
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
        setChannelProperty({commit, dispatch, state}, {pairs, allowDelete}) {
            for (const pair of pairs) {
                localStorage.setItem(
                    `CF_NODE:${pair.path}`,
                    typeof pair.value === 'string' ? pair.value : JSON.stringify(pair.value),
                );
            }
        },
        async initConnextChannel({commit, dispatch, state}) {
            const channel = await connext.connect({
                ...clientConfig,
                store: {
                    get(path) {
                        return dispatch('getChannelProperty', path);
                    },
                    set(pairs, allowDelete) {
                        return dispatch('setChannelProperty', {pairs, allowDelete});
                    }
                }
            });
            commit('setConnextChannel', channel);
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
        },
        async transfer({commit, dispatch, state}) {
            return await state.channel.transfer({
                recipient: 'xpub1abcdef',  //counterparty's xPub
                meta: 'Metadata for transfer',
                amount: '0x3abc', // in Wei, represented as bignumber
                assetId: ethers.constants.AddressZero // represents ETH
            });
        }
    }
});
