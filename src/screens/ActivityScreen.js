import PropTypes from 'prop-types';
import React from 'react';
import { compose, withHandlers } from 'recompact';
import styled from 'styled-components/primitives';
import { ActivityList } from '../components/activity-list';
import { Header, HeaderButton } from '../components/header';
import Icon from '../components/icons/Icon';
import { Column } from '../components/layout';
import { withAccountAddress, withAccountTransactions } from '../hoc';
import { colors, position } from '../styles';

const CloseButtonIcon = styled(Icon)`
  ${position.maxSize(19)}
`;

const Container = styled(Column)`
  ${position.size('100%')}
  background-color: ${colors.white};
  flex: 1;
`;

const ActivityScreen = ({
  accountAddress,
  fetchingTransactions,
  hasPendingTransaction,
  onPressBack,
  transactions,
}) => (
  <Container>
    <Header align="end">
      <HeaderButton align="end" onPress={onPressBack}>
        <CloseButtonIcon
          color={colors.brightBlue}
          name="close"
        />
      </HeaderButton>
    </Header>
    {(accountAddress && !fetchingTransactions) && (
      <ActivityList
        accountAddress={accountAddress}
        fetchingTransactions={fetchingTransactions}
        hasPendingTransaction={hasPendingTransaction}
        transactions={transactions}
      />
    )}
  </Container>
);

ActivityScreen.propTypes = {
  accountAddress: PropTypes.string,
  fetchingTransactions: PropTypes.bool,
  hasPendingTransaction: PropTypes.bool,
  onPressBack: PropTypes.func,
  transactions: PropTypes.array,
};

export default compose(
  withAccountAddress,
  withAccountTransactions,
  withHandlers({
    onPressBack: ({ navigation }) => () => navigation.goBack(),
  }),
)(ActivityScreen);