import { isFunction, omit } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AlertIOS } from 'react-native';
import lang from 'i18n-js';
import { connect } from 'react-redux';
import { walletConnectInit } from '../model/walletconnect';
import { addWalletConnector } from '../reducers/walletconnect';
import QRScannerScreen from './QRScannerScreen';

class QRScannerScreenWithData extends Component {
  static propTypes = {
    accountAddress: PropTypes.string,
    addWalletConnector: PropTypes.func,
    isScreenActive: PropTypes.bool,
    navigation: PropTypes.object,
  }

  shouldComponentUpdate = ({ isScreenActive, ...nextProps }) => {
    if (this.qrCodeScannerRef && this.qrCodeScannerRef.disable) {
      const isDisabled = this.qrCodeScannerRef.state.disablingByUser;

      if (isScreenActive && isDisabled && isFunction(this.qrCodeScannerRef.enable)) {
        console.log('📠✅ Enabling QR Code Scanner');
        this.qrCodeScannerRef.enable();
      } else if (!isScreenActive && !isDisabled && isFunction(this.qrCodeScannerRef.disable)) {
        console.log('📠🚫 Disabling QR Code Scanner');
        this.qrCodeScannerRef.disable();
      }
    }

    return nextProps === omit(this.props, 'isScreenActive');
  }

  onSuccess = async (event) => {
    const { accountAddress, navigation } = this.props;
    const data = event.data;

    if (data) {
      try {
        const walletConnector = await walletConnectInit(accountAddress, data);
        this.props.addWalletConnector(walletConnector);
        navigation.navigate('WalletScreen');
      } catch (error) {
        AlertIOS.alert(lang.t('wallet.wallet_connect.error'), error);
        console.log('error initializing wallet connect', error);
      }
    }
  }

  render = () => (
    <QRScannerScreen
      {...this.props}
      scannerRef={(ref) => { this.qrCodeScannerRef = ref; }}
      onSuccess={this.onSuccess}
    />
  )
}

const reduxProps = ({ account: { accountAddress } }) => ({ accountAddress });
export default connect(reduxProps, { addWalletConnector })(QRScannerScreenWithData);