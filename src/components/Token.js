import { useState, useEffect, useRef } from "react";
import { prepare, getResult } from "klip-sdk";
import BigNumber from "bignumber.js";
import Modal from "./Modal";
import Caver from "caver-js";
import QRCode from "qrcode.react";
import { Mobile, PC } from "./MediaQuery";
import "../CSS/Token.css";

import ABI from "../constants/ERC20ABI.json";
import { TOKENS_ADDRESS } from "../constants/TOKENS_ADDRESS";

const caver = new Caver("https://klaytn04.fandom.finance/");

function TokenShow({ list, address }) {
  const [sendTokenQrvalue, setSendTokenQrvalue] = useState("");
  const [tokenModalState, setTokenModalState] = useState(false);
  const [txHashModalState, setTxHashModalState] = useState(false);
  const [tokenTo, setTokenTo] = useState("");
  const [tokenAmount, setTokenAmount] = useState(null);
  const [tokenMessage, setTokenMessage] = useState("");
  const [clickContractAddress, setClickContractAddress] = useState(null);
  const [clickContractDecimal, setClickContractDecimal] = useState(null);
  const [tokenScopeLink, setTokenScopeLink] = useState(null);

  const toHandleChange = (e) => {
    setTokenTo(e.target.value);
    if (!tokenTo.startsWith("0x")) {
      setTokenMessage("Enter the address that starts with 0x.");
    } else {
      setTokenMessage("");
    }
  };
  const tokenAmountHandleChange = (e) => {
    setTokenAmount(e.target.value);
  };
  const tokenOpenModal = () => {
    setTokenModalState(true);
  };
  const tokenCloseModal = () => {
    setTokenModalState(false);
  };

  const tokenTxHashOpenModal = () => {
    setTxHashModalState(true);
  };
  const tokenTxHashCloseModal = () => {
    setTxHashModalState(false);
  };

  const tokenHandleSubmit = (event) => {
    event.preventDefault();
    if (tokenTo.startsWith("0x") && tokenTo.length === 42) {
      isClickSendBtn();
      setTokenTo("");
      setTokenAmount("");
      event.target[0].value = "";
      event.target[1].value = "";
    }
    setSendTokenQrvalue("");
  };

  const onClickContract = (e) => {
    const onClickAddress = list.ADDRESS;
    const onClickDecinal = list.DECIMALS;
    setClickContractAddress(onClickAddress);
    setClickContractDecimal(onClickDecinal);
  };

  async function sendToken() {
    const finalAmount = new BigNumber(tokenAmount)
      .multipliedBy(10 ** clickContractDecimal)
      .toString();
    const res = await prepare.executeContract({
      bappName: "Transfer Tokens",
      to: clickContractAddress,
      value: "0",
      abi: JSON.stringify(ABI[1]),
      params: JSON.stringify([tokenTo, finalAmount]),
    });
    return res;
  }

  function isClickSendBtn() {
    if (address.startsWith("0x") && tokenTo.startsWith("0x")) {
      sendToken().then((res) => {
        if (res.status === "prepared") {
          const token_request_key = res.request_key;
          const tokenQrcode = `https://klipwallet.com/?target=/a2a?request_key=${token_request_key}`;
          const sendTokenUserAgent = navigator.userAgent;

          if (sendTokenUserAgent.match(/iPhone|iPad|iPod/)) {
            setTimeout(function () {
              window.location.href = `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${token_request_key}`;
            }, 500);
          } else if (sendTokenUserAgent.match(/Android/)) {
            setTimeout(function () {
              window.location.href = `intent://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${token_request_key}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`;
            }, 500);
          } else {
            setSendTokenQrvalue(tokenQrcode);
          }

          let timerToken = setInterval(() => {
            getResult(token_request_key).then((res) => {
              if (res.status === "completed") {
                const tokenTxHash = res.result.tx_hash;
                const _tokenScopeLink = `https://scope.klaytn.com/tx/${tokenTxHash}?tabId=tokenTransfer`;
                setTokenScopeLink(_tokenScopeLink);
                tokenCloseModal();
                tokenTxHashOpenModal();
                clearInterval(timerToken);
              }
            });
          }, 1000);
        }
      });
    }
  }

  return (
    <div>
      <PC className="pc-container">
        <details className="lists-area">
          <summary className="token-area" onClick={onClickContract}>
            <img
              className="tokenIMG"
              src={require("/public/Tokens/" + list.SYMBOL + ".png")}
              alt={list.SYMBOL}
              title={list.SYMBOL}
            />
            {list.SYMBOL} : <span>{list.AMOUNT}</span>
            <span className="open-send">Send💰</span>
          </summary>
          <span>
            <form onSubmit={tokenHandleSubmit}>
              <div className="message-area">{tokenMessage}</div>
              <input
                className="input-area"
                placeholder="Address(To)"
                type="text"
                onChange={toHandleChange}
              />
              <br />
              <input
                className="input-area"
                placeholder="Amount(Token)"
                type="number"
                inputMode="decimal"
                min="0"
                max={list.AMOUNT}
                step="0.000001"
                onChange={tokenAmountHandleChange}
              />

              <br />
              <button
                className="sendBtn"
                type="submit"
                onClick={tokenOpenModal}
                onSubmit={tokenHandleSubmit}
              >
                Send
              </button>
            </form>
          </span>
          <div>
            {sendTokenQrvalue ? (
              <Modal
                open={tokenModalState}
                close={tokenCloseModal}
                header="SendToken QRcode"
              >
                <QRCode value={sendTokenQrvalue}></QRCode>
                <div className="QrMessage">
                  Scan the QR code with the camera.
                </div>
              </Modal>
            ) : null}
          </div>
          <div>
            {tokenScopeLink ? (
              <Modal
                open={txHashModalState}
                close={tokenTxHashCloseModal}
                header="Transaction result"
              >
                <div className="txHashMessage">
                  The transaction was successful.
                  <br />
                  <a
                    href={tokenScopeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Transaction result.
                  </a>
                </div>
              </Modal>
            ) : null}
          </div>
        </details>
      </PC>
      <Mobile className="mobile-container">
        <details className="mobile-lists-area">
          <summary className="mobile-token-area" onClick={onClickContract}>
            <img
              className="tokenIMG"
              src={require("/public/Tokens/" + list.SYMBOL + ".png")}
              alt={list.SYMBOL}
              title={list.SYMBOL}
            />
            {list.SYMBOL} : <span>{list.AMOUNT}</span>
            <span className="mobile-open-send">Send💰</span>
          </summary>
          <span>
            <form onSubmit={tokenHandleSubmit}>
              <div className="message-area">{tokenMessage}</div>
              <input
                className="mobile-input-area"
                placeholder="Address(To)"
                type="text"
                onChange={toHandleChange}
              />
              <br />
              <input
                className="mobile-input-area"
                placeholder="Amount(Token)"
                type="number"
                min="0"
                max={list.AMOUNT}
                step="0.000001"
                onChange={tokenAmountHandleChange}
              />

              <br />
              <div>
                {navigator.userAgent === /Android|iPhone|iPad|iPod/ && (
                  <button
                    className="sendBtn"
                    type="submit"
                    onSubmit={tokenHandleSubmit}
                  >
                    Send
                  </button>
                )}
                {navigator.userAgent !== /Android|iPhone|iPad|iPod/ && (
                  <button
                    className="sendBtn"
                    type="submit"
                    onClick={tokenOpenModal}
                    onSubmit={tokenHandleSubmit}
                  >
                    Send
                  </button>
                )}
              </div>
            </form>
          </span>
          <div>
            {sendTokenQrvalue ? (
              <Modal
                open={tokenModalState}
                close={tokenCloseModal}
                header="SendToken QRcode"
              >
                <QRCode value={sendTokenQrvalue}></QRCode>
                <div className="QrMessage">
                  Scan the QR code with the camera.
                </div>
              </Modal>
            ) : null}
          </div>
          <div>
            {tokenScopeLink ? (
              <Modal
                open={txHashModalState}
                close={tokenTxHashCloseModal}
                header="Transaction result"
              >
                <div className="txHashMessage">
                  The transaction was successful.
                  <br />
                  <a
                    href={tokenScopeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Transaction result.
                  </a>
                </div>
              </Modal>
            ) : null}
          </div>
        </details>
      </Mobile>
    </div>
  );
}

export default function Token({ address }) {
  const [tokenAmountArray, setTokenAmountArray] = useState([
    {
      id: "",
      SYMBOL: "",
      AMOUNT: "",
      ADDRESS: "",
    },
  ]);

  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    getTokenBalance(address);
  }, [address]);

  // Check the tokens balance.
  async function getTokenBalance(address) {
    const newArray = await Promise.all(
      TOKENS_ADDRESS.map(async (obj) => {
        const contract = new caver.klay.Contract(ABI, obj.ADDRESS);
        const result = await contract.methods.balanceOf(address).call();
        const format = caver.utils.fromWei(result);

        if (format !== "0") {
          const balance = Number(format).toFixed(6);
          const isTokenList = {
            id: obj.SYMBOL,
            SYMBOL: obj.SYMBOL,
            DECIMALS: obj.DECIMALS,
            AMOUNT: balance,
            ADDRESS: obj.ADDRESS,
          };
          return isTokenList;
        } else {
          const noTokenList = {
            id: obj.SYMBOL,
            SYMBOL: obj.SYMBOL,
            DECIMALS: obj.DECIMALS,
            AMOUNT: format,
            ADDRESS: obj.ADDRESS,
          };
          return noTokenList;
        }
      })
    );
    setTokenAmountArray(newArray);
  }

  return (
    <div>
      {tokenAmountArray[1] ? (
        <section>
          {tokenAmountArray
            .sort((a, b) => (a.AMOUNT < b.AMOUNT ? 1 : -1))
            .map((list) => (
              <TokenShow key={list.SYMBOL} list={list} address={address} />
            ))}
        </section>
      ) : null}
    </div>
  );
}
