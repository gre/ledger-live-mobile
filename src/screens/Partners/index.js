// @flow

/**
 * MOBILE problems
 * - all the links need to be target _blank because right now it opens IN the iframe from a mobile webview. so it's really bad. it should open in navigator (safari / chrome)
 * - the email field doesn't prevent the auto case of the keyboard.
 * - for same reason as desktop. I can't test the "step events" for us to implement a special effect to trigger on device so i can't go farther in this investigation.
 */

import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import { WebView } from "react-native-webview";
import querystring from "querystring";
import { useSelector } from "react-redux";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { accountsSelector } from "../../reducers/accounts";
import Button from "../../components/Button";
import LText from "../../components/LText";

import colors from "../../colors";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";

const forceInset = { bottom: "always" };

const Main = ({ account, sandbox }: { account: Account, sandbox: boolean }) => {
  const primaryColor = colors.live;
  const fontColor = colors.darkBlue;
  const url = sandbox
    ? "https://trade-ui.sandbox.coinify.com/widget"
    : "https://trade-ui.coinify.com/widget";
  const partnerId = sandbox ? 104 : 119;

  return (
    <>
      <WebView
        source={{
          uri:
            url +
            "?" +
            querystring.stringify({
              fontColor,
              primaryColor,
              partnerId,
              cryptoCurrencies: account.currency.ticker,
              address: account.freshAddress,
            }),
        }}
      />
    </>
  );
};

const Root = () => {
  const accounts = useSelector(accountsSelector);
  // ^FIXME in reality we would have to filter only supported accounts
  const [account] = useState(accounts[0]);
  const [sandbox] = useState(true);
  // ^FIXME in reality we would have no sandbox mode here (but maybe a env var)
  const [main, setMain] = useState(false);

  if (main && account) {
    return <Main account={account} sandbox={sandbox} />;
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <LText style={{ marginBottom: 10 }}>
        using: {(account && account.name) || "no account"}
      </LText>
      <Button type="primary" onPress={() => setMain(true)} title="Continue" />
    </View>
  );
};

const ExchangeScreen = () => {
  return (
    <SafeAreaView
      style={[styles.root, { paddingTop: extraStatusBarPadding }]}
      forceInset={forceInset}
    >
      <Root />
    </SafeAreaView>
  );
};

ExchangeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  scrollView: {
    paddingTop: 24,
    flex: 1,
  },
  body: {
    overflow: "visible",
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
  list: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: colors.darkBlue,
  },
  description: {
    marginTop: 5,
    marginBottom: 24,
    fontSize: 14,
    color: colors.grey,
  },
});

export default ExchangeScreen;
