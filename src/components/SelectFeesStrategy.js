/* @flow */
import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";
import LText from "./LText";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { useTheme } from "@react-navigation/native";
import SummaryRow from "../screens/SendFunds/SummaryRow";
import CheckBox from "./CheckBox";
import CounterValue from "./CounterValue";
import CurrencyUnitValue from "./CurrencyUnitValue";
import {
  getAccountUnit,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/ethereum/types";
import SectionSeparator from "./SectionSeparator";
import BottomModal from "./BottomModal";
import Info from "../icons/Info";
import NetworkFeeInfo from "./NetworkFeeInfo";

type Props = {
  strategies: any,
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  onStrategySelect: Function,
  onCustomFeesPress: Function,
};

const CVWrapper = ({ children }: { children: * }) => (
  <LText semiBold color="grey">
    {children}
  </LText>
);

export default function SelectFeesStrategy({
  strategies,
  account,
  transaction,
  onStrategySelect,
  onCustomFeesPress,
}: Props) {
  const { colors } = useTheme();
  const mainAccount = getMainAccount(account, undefined);
  const currency = getAccountCurrency(mainAccount);
  const unit = getAccountUnit(account);

  const [isNetworkFeeHelpOpened, setNetworkFeeHelpOpened] = useState(false);
  const toggleNetworkFeeHelpModal = useCallback(
    () => setNetworkFeeHelpOpened(!isNetworkFeeHelpOpened),
    [isNetworkFeeHelpOpened],
  );
  const closeNetworkFeeHelpModal = () => setNetworkFeeHelpOpened(false);

  const isChecked = (label, transaction) => transaction.feesStrategy === label;

  return (
    <>
      <BottomModal
        id="NetworkFee"
        isOpened={isNetworkFeeHelpOpened}
        preventBackdropClick={false}
        onClose={closeNetworkFeeHelpModal}
      >
        <NetworkFeeInfo onClose={closeNetworkFeeHelpModal} />
      </BottomModal>

      <View>
        <SectionSeparator lineColor={colors.lightFog} />
        <SummaryRow
          onPress={toggleNetworkFeeHelpModal}
          title={<Trans i18nKey="send.summary.fees" />}
          additionalInfo={
            <View>
              <Info size={12} color={colors.grey} />
            </View>
          }
        >
          {null}
        </SummaryRow>
        <ScrollView style={styles.strategiesContainer}>
          {strategies.map((s, index) => (
            <TouchableOpacity
              key={index + s.label}
              onPress={() => {
                onStrategySelect({
                  amount: s.amount,
                  label: s.label,
                  userGasLimit: s.userGasLimit,
                });
              }}
              style={[
                styles.feeButton,
                {
                  borderColor: isChecked(s.label, transaction)
                    ? colors.live
                    : colors.background,
                  backgroundColor: isChecked(s.label, transaction)
                    ? colors.lightLive
                    : colors.lightFog,
                },
              ]}
            >
              <View style={styles.feeStrategyContainer}>
                <View style={styles.leftBox}>
                  <CheckBox
                    style={styles.checkbox}
                    isChecked={isChecked(s.label, transaction)}
                  />
                  <LText semiBold style={styles.feeLabel}>
                    {s.label}
                  </LText>
                </View>
                <View style={styles.feesAmountContainer}>
                  <LText semiBold style={styles.feesAmount}>
                    <CurrencyUnitValue
                      showCode
                      unit={s.unit ?? unit}
                      value={s.displayedAmount ?? s.amount}
                    />
                  </LText>
                  <CounterValue
                    currency={currency}
                    showCode
                    value={s.displayedAmount ?? s.amount}
                    alwaysShowSign={false}
                    withPlaceholder
                    Wrapper={CVWrapper}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.customizeFeesButton,
            { backgroundColor: colors.lightLive },
          ]}
          onPress={() => {
            onCustomFeesPress();
          }}
        >
          <LText semiBold color="live">
            <Trans i18nKey="send.summary.customizeFees" />
          </LText>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  strategiesContainer: {
    flex: 1,
  },
  leftBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  feeStrategyContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feesAmountContainer: {
    alignItems: "flex-end",
  },
  feeButton: {
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    marginVertical: 4,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  feeLabel: { fontSize: 16, textTransform: "capitalize", marginLeft: 10 },
  feesAmount: { fontSize: 15 },
  checkbox: {
    borderRadius: 24,
    width: 20,
    height: 20,
  },
  customizeFeesButton: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
});
