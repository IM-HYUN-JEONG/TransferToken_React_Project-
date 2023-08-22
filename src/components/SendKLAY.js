import { ReactComponent as KlipIcon } from "../img/klip.svg";
import { Mobile, PC } from "./MediaQuery";
import { prepare, getResult } from "klip-sdk";
import { useState } from "react";
import KLAY from "../img/KLAY.png";
import Modal from "./Modal";
import QRCode from "qrcode.react";
import "../CSS/SendKLAY.css";

export default function SendKLAY({ address, balance }) {
  const [sendKLAYQrvalue, setSendKLAYQrvalue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(null);
  const [message, setMessage] = useState("");
  const [klayScopeLink, setKlayScopeLink] = useState(null);
  const [klayTxHashModalState, setKlayTxHashModalState] = useState(false);

  const toHandleChange = (e) => {
    setTo(e.target.value);
    if (!to.startsWith("0x")) {
      setMessage("Enter the address that starts with 0x.");
    } else {
      setMessage("");
    }
  };
  const amountHandleChange = (e) => {
    setAmount(e.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (address.startsWith("0x") && to.startsWith("0x") && to.length === 42) {
      klayQrcodeValue();
      setTo("");
      setAmount("");
      event.target[0].value = "";
      event.target[1].value = "";
    }
    setSendKLAYQrvalue("");
  };

  const klayoOenModal = () => {
    setModalOpen(true);
  };
  const klayCloseModal = () => {
    setModalOpen(false);
  };

  const klayTxHashOpenModal = () => {
    setKlayTxHashModalState(true);
  };
  const klayTxHashCloseModal = () => {
    setKlayTxHashModalState(false);
  };

  const BAPP_NAME = "Trensfer Tokens";

  async function klaySend() {
    const res = await prepare.sendKLAY({
      BAPP_NAME,
      address,
      to,
      amount,
    });
    return res;
  }

  function klayQrcodeValue() {
    const sendKLAYUserAgent = navigator.userAgent;

    if (address.startsWith("0x") && to.startsWith("0x")) {
      klaySend().then((res) => {
        if (res.status === "prepared") {
          const klay_request_key = res.request_key;
          const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${klay_request_key}`;

          if (sendKLAYUserAgent.match(/iPhone|iPad|iPod/)) {
            setTimeout(function () {
              window.location.href = `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${klay_request_key}`;
            }, 500);
          } else if (sendKLAYUserAgent.match(/Android/)) {
            setTimeout(function () {
              window.location.href = `intent://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${klay_request_key}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`;
            }, 500);
          } else {
            setSendKLAYQrvalue(qrcode);
          }
          let timerKLAY = setInterval(() => {
            getResult(klay_request_key).then((res) => {
              if (res.status === "completed") {
                const klayTxHash = res.result.tx_hash;
                const klayTxAddress = `https://scope.klaytn.com/tx/${klayTxHash}?tabId=tokenTransfer`;
                setKlayScopeLink(klayTxAddress);

                klayCloseModal();
                klayTxHashOpenModal();
                clearInterval(timerKLAY);
              }
            });
          }, 1000);
        }
      });
    }
  }

  return (
    <div>
      <PC>
        <div className="display-area">
          <div className="items-area address-area">
            Address : <span className="address">{address}</span>
          </div>
          {address ? (
            <details>
              <summary className="items-area">
                <img className="klayIMG" src={KLAY} alt="KLAY" title="KLAY" />
                KLAY : {balance}
                <span className="open-send">Send💰</span>
              </summary>

              <span>
                <form onSubmit={handleSubmit}>
                  <div className="message-area">{message}</div>
                  <input
                    className="input-area"
                    placeholder="Address (To)"
                    type="text"
                    onChange={toHandleChange}
                  />
                  <br />
                  <input
                    className="input-area"
                    placeholder="Amount (KLAY)"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max={balance}
                    step="0.000001"
                    onChange={amountHandleChange}
                  />

                  <br />
                  <button
                    className="sendBtn"
                    type="submit"
                    onClick={klayoOenModal}
                    onSubmit={handleSubmit}
                  >
                    Send
                  </button>
                </form>
              </span>
            </details>
          ) : null}
        </div>

        {sendKLAYQrvalue ? (
          <Modal
            open={modalOpen}
            close={klayCloseModal}
            header="SendKLAY QRcode"
          >
            <QRCode value={sendKLAYQrvalue}></QRCode>
            <div className="QrMessage">Scan the QR code with the camera.</div>
          </Modal>
        ) : null}
        <div>
          {klayScopeLink ? (
            <Modal
              open={klayTxHashModalState}
              close={klayTxHashCloseModal}
              header="Transaction result"
            >
              <div className="txHashMessage">
                The transaction was successful.
                <br />
                <a
                  href={klayScopeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Transaction result.
                </a>
              </div>
            </Modal>
          ) : null}
        </div>
      </PC>

      <Mobile>
        <div className="display-area">
          <div className="mobile-address-area">
            Address : <span className="mobile-address">{address}</span>
          </div>
          {address ? (
            <details>
              <summary className="mobile-items-area">
                <img className="klayIMG" src={KLAY} alt="KLAY" title="KLAY" />
                KLAY : {balance}
                <span className="mobile-open-send">Send💰</span>
              </summary>

              <span>
                <form onSubmit={handleSubmit}>
                  <div className="message-area">{message}</div>
                  <input
                    className="mobile-input-area"
                    placeholder="Address (To)"
                    type="text"
                    onChange={toHandleChange}
                  />
                  <br />
                  <input
                    className="mobile-input-area"
                    placeholder="Amount (KLAY)"
                    type="number"
                    min="0"
                    max={balance}
                    step="0.000001"
                    onChange={amountHandleChange}
                  />

                  <br />
                  <div>
                    {navigator.userAgent === /Android|iPhone|iPad|iPod/ && (
                      <button
                        className="sendBtn"
                        type="submit"
                        onSubmit={handleSubmit}
                      >
                        Send
                      </button>
                    )}
                    {navigator.userAgent !== /Android|iPhone|iPad|iPod/ && (
                      <button
                        className="sendBtn"
                        type="submit"
                        onClick={klayoOenModal}
                        onSubmit={handleSubmit}
                      >
                        Send
                      </button>
                    )}
                  </div>
                </form>
              </span>
            </details>
          ) : null}
        </div>
        <div>
          {sendKLAYQrvalue ? (
            <Modal
              open={modalOpen}
              close={klayCloseModal}
              header="SendKLAY QRcode"
            >
              <QRCode value={sendKLAYQrvalue}></QRCode>
              <div className="QrMessage">
                {" "}
                <KlipIcon width="41" height="22" />
                Scan the QR code with the camera.
              </div>
            </Modal>
          ) : null}
          <div>
            {klayScopeLink ? (
              <Modal
                open={klayTxHashModalState}
                close={klayTxHashCloseModal}
                header="Transaction result"
              >
                <div className="txHashMessage">
                  The transaction was successful.
                  <br />
                  <a
                    href={klayScopeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Transaction result.
                  </a>
                </div>
              </Modal>
            ) : null}
          </div>
        </div>
      </Mobile>
    </div>
  );
}
