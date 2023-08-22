import { ReactComponent as KlipIcon } from "../img/klip.svg";
import React, { useState, useEffect } from "react";
import { Mobile, PC } from "./MediaQuery";
import Modal from "./Modal";
import QRCode from "qrcode.react";
import Caver from "caver-js";
import axios from "axios";
import "../CSS/Klip.css";

export default function Klip({ address, setAddress, setBalance }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [qrvalue, setQrvalue] = useState("");

  const BAPP_NAME = "Transfer Tokens";
  const A2A_API_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
  let klaytn_address = null;

  const klipOpenModal = () => {
    setModalOpen(true);
  };
  const klipCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    klipCloseModal();
  }, [address]);

  const caver = new Caver("https://public-node-api.klaytnapi.com/v1/cypress");

  async function getBalance(address) {
    await caver.rpc.klay.getBalance(address).then(async (res) => {
      const nativeBalance = caver.utils.convertFromPeb(
        caver.utils.hexToNumberString(res)
      );
      const splitBalance = nativeBalance.split(".");
      const decimals = splitBalance[1].substring(0, 6);
      const balance = splitBalance[0] + "." + decimals;
      return setBalance(balance);
    });
  }

  function getAddress() {
    const klipUserAgent = navigator.userAgent;
    axios
      .post(A2A_API_URL, {
        bapp: {
          name: BAPP_NAME,
        },
        type: "auth",
      })
      .then((res) => {
        const { request_key } = res.data;
        const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;

        if (klipUserAgent.match(/iPhone|iPad|iPod/)) {
          setTimeout(function () {
            window.location.href = `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
          }, 500);
        } else if (klipUserAgent.match(/Android/)) {
          setTimeout(function () {
            window.location.href = `intent://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${request_key}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`;
          }, 500);
        } else {
          setQrvalue(qrcode);
        }

        let timerId = setInterval(() => {
          axios
            .get(
              `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
            )
            .then((res) => {
              if (res.data.result) {
                klaytn_address = JSON.stringify(res.data.result).substring(
                  19,
                  61
                );

                if (res.data.status === "completed") {
                  clearInterval(timerId);
                  setAddress(klaytn_address);
                  getBalance(klaytn_address);
                }
                clearInterval(timerId);
              }
            });
        }, 1000);
      });
  }

  return (
    <div>
      <PC>
        {!address ? (
          <div>
            <div>Send Tokens that are not in the Klip.</div>
            <div onClick={klipOpenModal}>
              <button id="klipBtn" onClick={getAddress}>
                <KlipIcon width="41" height="22" />
                <span className="klipMsg">Klip으로 로그인</span>
              </button>
            </div>
          </div>
        ) : null}
        <div>
          {qrvalue && (
            <Modal
              open={modalOpen}
              close={klipCloseModal}
              header="카카오 Klip QR 연결"
            >
              <QRCode value={qrvalue}></QRCode>
              <div className="QrMessage">Scan the QR code with the camera.</div>
            </Modal>
          )}
        </div>
      </PC>
      <Mobile>
        {!address && navigator.userAgent !== /Android|iPhone|iPad|iPod/ ? (
          <div>
            <div>Send Tokens that are not in the Klip.</div>

            <div onClick={klipOpenModal}>
              <button id="mobile-klipBtn" onClick={getAddress}>
                <KlipIcon width="38" height="19" />
                <span className="klipMsg">Klip으로 로그인</span>
              </button>
            </div>
          </div>
        ) : null}

        {!address && navigator.userAgent === /Android|iPhone|iPad|iPod/ ? (
          <div>
            <div>Send Tokens that are not in the Klip.</div>
            <button id="mobile-klipBtn" onClick={getAddress}>
              <KlipIcon width="38" height="19" />
              <span className="klipMsg">Klip으로 로그인</span>
            </button>
          </div>
        ) : null}

        <div>
          {qrvalue && (
            <Modal
              open={modalOpen}
              close={klipCloseModal}
              header="카카오 Klip QR 연결"
            >
              <QRCode value={qrvalue}></QRCode>
              <div className="QrMessage">Scan the QR code with the camera.</div>
            </Modal>
          )}
        </div>
      </Mobile>
    </div>
  );
}
