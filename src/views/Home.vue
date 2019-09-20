<template>
    <div>
        <div class="row">
            <div class="col">
                <h4>Open your console to see more of whats going on!</h4>
            </div>
        </div>

        <hr/>

        <div class="row">
            <div class="col">
                <b-button v-on:click="connect">Connect</b-button>

                <b-button
                        v-on:click="overrideNmnemonic = 'fly control dial wisdom lunar dynamic hawk guilt predict guilt earth early'">
                    Set counterparty
                </b-button>

                <p class="pt-1">
                    Override default mnemonic
                    <b-form-input v-model="overrideNmnemonic"
                                  placeholder="Provide alternative mnemonic (good to counter party transfer test)">
                    </b-form-input>
                </p>
                <p>
                    Once you’ve set your parameters, call connext.connect() to establish a connection with your
                    channel
                </p>
                <div v-if="channel">
                    Free Balance Address <span class="small text-muted">Special account derived for your free balance address.</span>
                    <p>
                        <code>{{channel.freeBalanceAddress}}</code>
                    </p>
                    <p class="text-muted">
                        Whats referenced as the freeBalanceAddress - each app will have its own designated signing key,
                        the freeBalanceAddress is what will be put into the app state, so is what will receive the
                        funds in the event of a dispute.
                    </p>
                    <p class="text-muted">
                        You can withdraw to any address that you want though.
                    </p>
                    <p class="text-muted">
                        // 25446 is 0x6366... or "cf" in ascii, for "Counterfactual". export const CF_PATH =
                        "m/44'/60'/0'/25446";
                    </p>
                </div>
                <div v-if="channel">
                    <code>{{channel.publicIdentifier}}</code>
                    <pre>{{channel.network}}</pre>
                </div>
            </div>
        </div>

        <hr/>

        <div class="row">
            <div class="col">
                <b-button v-on:click="getChannelInfo">Get Channel Info</b-button>
                <pre>{{channelData}}</pre>
            </div>
        </div>

        <hr/>

        <div class="row">
            <div class="col">
                <b-button v-on:click="getChannelBalance">Get Balance</b-button>
                (in wei)
                <p class="text-primary">Get balances for your channel</p>
                <pre>{{balances}}</pre>
            </div>
        </div>

        <hr/>

        <div class="row">
            <div class="col">
                <b-button v-on:click="deposit">Deposit into Channel</b-button>
                <p class="text-primary">Deposit from on-chain into multi-sig which populates your channel</p>
                <p class="text-muted">
                    After instantiating and starting Connext, you can deposit into a channel with channel.deposit. Our
                    hosted node accepts deposits in ETH and all ERC20 tokens. However, when depositing tokens, ensure
                    the user has sufficient ETH remaining in their wallet to afford the gas of the deposit transaction.
                </p>
            </div>
        </div>

        <hr/>

        <div class="row">
            <div class="col">
                <b-button v-on:click="requestCollateral">Request Collateral</b-button>

                <b-form-input v-model="requestCollateralAddress"
                              placeholder="Address to request Collateral">
                </b-form-input>

                <p class="text-primary">requestCollateral()</p>
            </div>
        </div>

        <hr/>

        <div class="row">
            <div class="col">
                <b-button v-on:click="exchange">Exchange</b-button>
                <p>For now, our testnet node is opinionated and only collateralizes each channel with DAI by default.
                    (E.e. only DAI transfers are allowed) If you need ETH transfers, get in touch and we’ll set you up
                    with Eth-collateralized channels!</p>
            </div>
        </div>

        <hr/>

        <div class="row">
            <div class="col">
                <b-form-input v-model="transferCounterPartyXPub"
                              placeholder="Counterparty’s xPub identifier (Recipient)">
                </b-form-input>
                <p class="pt-1">
                    <b-button v-on:click="transfer">Transfer</b-button>
                </p>
                <p>Recipient is identified by the counterparty’s xPub identifier, which you can find with
                    channel.publicIdentifier.</p>
            </div>
        </div>

        <hr/>

        <div class="row">
            <div class="col">
                <b-form-input v-model="withdrawalAddress">
                </b-form-input>
                <p class="pt-1">
                    <b-button v-on:click="withdraw">Withdraw</b-button>
                </p>
                <p>
                    Users can withdraw funds to any recipient address with channel.withdraw(). Right now, the node only
                    supports withdrawals in ETH to mitigate spam. When withdrawing, DAI that is in your channel is
                    automatically exchanged for ETH as part of the withdrawal process. If you need DAI (or DAI + ETH)
                    withdrawals, get in touch and we can activate them for your channels.
                </p>
            </div>
        </div>
    </div>
</template>

<script>

    import {mapState} from 'vuex';
    import * as _ from 'lodash';

    export default {
        name: 'home',
        components: {},
        data() {
            return {
                channelData: {},
                balances: {},
                transferCounterPartyXPub: null,
                overrideNmnemonic: null,
                withdrawalAddress: null,
                requestCollateralAddress: null,
            };
        },
        computed: {
            ...mapState(['channel'])
        },
        methods: {
            connect() {
                this.$store.dispatch('initConnextChannel', this.overrideNmnemonic);
            },
            deposit() {
                this.$store.dispatch('deposit');
            },
            exchange() {
                this.$store.dispatch('exchange');
            },
            transfer() {
                this.$store.dispatch('transfer', this.transferCounterPartyXPub);
            },
            withdraw() {
                this.$store.dispatch('withdraw', this.withdrawalAddress);
            },
            requestCollateral() {
                this.$store.dispatch('requestCollateral', this.requestCollateralAddress);
            },
            getChannelInfo() {
                this.channel.getChannel()
                    .then((data) => {
                        this.channelData = data;
                    });
            },
            getChannelBalance() {
                return this.channel.getFreeBalance()
                    .then((data) => {
                        let balances = {};
                        _.forEach(data, (value, key) => {
                            balances[key] = value.toString();
                        });
                        this.balances = balances;
                    });
            }
        }
    };
</script>
