// @flow
import React from "react";
import Svg, { Path, G } from "react-native-svg";

type Props = {
  size: number,
};

export default function ReceiveUnconfirmed({ size = 25 }: Props) {
  return (
    <Svg viewBox="0 0 25 25" width={size} height={size}>
      <G fillRule="nonzero" fill="none">
        <Path
          d="M23.574 15.18a6 6 0 0 0-.89-.548C22.89 13.789 23 12.907 23 12c0-6.075-4.925-11-11-11S1 5.925 1 12s4.925 11 11 11c.907 0 1.789-.11 2.632-.317a6 6 0 0 0 .548.891c-1.013.278-2.079.426-3.18.426-6.627 0-12-5.373-12-12S5.373 0 12 0s12 5.373 12 12c0 1.101-.148 2.167-.426 3.18z"
          fill="#66BE54"
        />
        <Path
          d="M23.574 15.18a6 6 0 0 0-8.394 8.394c-1.013.278-2.079.426-3.18.426-6.627 0-12-5.373-12-12S5.373 0 12 0s12 5.373 12 12c0 1.101-.148 2.167-.426 3.18z"
          fillOpacity={0.05}
          fill="#66BE54"
        />
        <Path
          d="M15.267 16.313a6 6 0 0 0-.694 1.125H8.187c-.276 0-.5-.252-.5-.563 0-.31.224-.563.5-.563h7.08zm-2.704-2.483l2.04-2.04a.563.563 0 0 1 .795.795l-2.922 2.922a.572.572 0 0 1-.5.243.572.572 0 0 1-.452-.243l-2.922-2.922a.563.563 0 0 1 .796-.795l2.04 2.04V6.896c0-.288.251-.521.562-.521.31 0 .563.233.563.52v6.935z"
          fill="#66BE54"
        />
        <Path
          d="M20 15.365a4.635 4.635 0 1 1 0 9.27 4.635 4.635 0 0 1 0-9.27zm0 .937a3.698 3.698 0 1 0 0 7.396 3.698 3.698 0 0 0 0-7.396zm.469 3.504l1.112 1.113a.469.469 0 1 1-.662.662l-1.25-1.25A.469.469 0 0 1 19.53 20v-2.5a.469.469 0 1 1 .938 0v2.306z"
          fill="#999"
        />
      </G>
    </Svg>
  );
}