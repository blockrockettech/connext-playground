<template>
    <div>
        <div class="row">
            <div class="col">
                <h4>Open your console to see more of whats going on!</h4>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <b-button v-on:click="connect">Connect</b-button>
                <p>
                    Once you’ve set your parameters, call connext.connect() to establish a connection with your
                    channel
                </p>
                <div v-if="channel">freeBalanceAddress
                    <pre>{{channel.freeBalanceAddress}}</pre>
                </div>
                <div v-if="channel">network
                    <pre>{{channel.network}}</pre>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <b-button v-on:click="getChannelInfo">Get Channel Info</b-button>
                <pre>{{channelData}}</pre>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <b-button v-on:click="getChannelBalance">Get Balance</b-button> (in wei)
                <pre>{{balances}}</pre>
            </div>
        </div>


        <div class="row">
            <div class="col">
                <b-button v-on:click="deposit">Deposit</b-button>
                <p>
                    After instantiating and starting Connext, you can deposit into a channel with channel.deposit. Our
                    hosted node accepts deposits in ETH and all ERC20 tokens. However, when depositing tokens, ensure
                    the user has sufficient ETH remaining in their wallet to afford the gas of the deposit transaction.
                </p>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <b-button v-on:click="exchange">Exchange</b-button>
                <p>For now, our testnet node is opinionated and only collateralizes each channel with DAI by default.
                    (E.e. only DAI transfers are allowed) If you need ETH transfers, get in touch and we’ll set you up
                    with Eth-collateralized channels!</p>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <b-button v-on:click="transfer">Transfer</b-button>
                <p>Recipient is identified by the counterparty’s xPub identifier, which you can find with
                    channel.publicIdentifier.</p>
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
                balances: {}
            };
        },
        computed: {
            ...mapState(['channel'])
        },
        methods: {
            connect() {
                this.$store.dispatch('initConnextChannel');
            },
            deposit() {
                this.$store.dispatch('deposit');
            },
            exchange() {
                this.$store.dispatch('exchange');
            },
            transfer() {
                this.$store.dispatch('transfer');
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
