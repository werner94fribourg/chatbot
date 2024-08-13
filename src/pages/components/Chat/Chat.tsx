import { NextPage } from 'next';
import Image from 'next/image';
import React, { FormEventHandler, useRef, useState } from 'react';
import styles from './Chat.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { askChatbot } from '@/store/slices/chat';
//import the css here

const Chat: NextPage = () => {
  let hide = {
    display: 'none',
  };
  let show = {
    display: 'block',
  };
  let textRef = useRef<HTMLTextAreaElement>(null);
  const { questions, answers, isLoading } = useSelector(
    (state: {
      chat: { questions: string[]; answers: string[]; isLoading: boolean };
    }) => state.chat
  );
  const dispatch = useDispatch();

  const [chatopen, setChatopen] = useState(false);
  const toggle = () => {
    setChatopen(!chatopen);
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    if (textRef.current === null) return;

    askChatbot(textRef.current.value, dispatch);
    textRef.current.value = '';
  };
  return (
    <div className={styles.chat}>
      <div className={styles.chatbox} style={chatopen ? show : hide}>
        <div className={styles.header}>Chat with me</div>
        <div className={styles['msg-area']}>
          {answers.map((answer, i) => (
            <React.Fragment key={i}>
              <p className={styles.left}>
                <span>{answer}</span>
              </p>
              {questions[i] && (
                <p className={styles.right}>
                  <span>{questions[i]}</span>
                </p>
              )}
            </React.Fragment>
          ))}
        </div>
        <form onSubmit={handleSend}>
          <div className={styles.footer}>
            <textarea cols={1} rows={4} ref={textRef} disabled={isLoading} />
            <button className={styles['submit-button']}>
              <FontAwesomeIcon icon={faPaperPlane} size="6x" />
            </button>
          </div>
        </form>
      </div>
      <div className={styles.pop}>
        <Image
          height={40}
          width={20}
          onClick={toggle}
          src="https://p7.hiclipart.com/preview/151/758/442/iphone-imessage-messages-logo-computer-icons-message.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default Chat;
