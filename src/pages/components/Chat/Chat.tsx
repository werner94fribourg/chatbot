import { NextPage } from 'next';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import styles from './Chat.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { askChatbot, clearContext } from '@/store/slices/chat';
import icon from './QA_icon.png';

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
  };

  const handleBtnClick = (e: React.MouseEvent) => {
    if (isLoading) return;
    if (textRef.current === null) return;
    const {
      currentTarget: { id },
    } = e;

    if (id === 'submit-context') askChatbot(textRef.current.value, dispatch);
    else clearContext(dispatch);

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
                <span>
                  {answer.split('\n').map((line, j) => (
                    <React.Fragment key={`${i}-${j}`}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </span>
              </p>
              {questions[i] && (
                <p className={styles.right}>
                  <span>{questions[i]}</span>
                </p>
              )}
            </React.Fragment>
          ))}
        </div>
        <form id="formId" onSubmit={handleSend}>
          <div className={styles.footer}>
            <textarea cols={1} rows={4} ref={textRef} disabled={isLoading} />
            <button className={styles['submit-button']}>
              <FontAwesomeIcon
                icon={faPaperPlane}
                id="submit-context"
                size="4x"
                style={{ cursor: 'pointer' }}
                onClick={handleBtnClick}
              />
              <FontAwesomeIcon
                icon={faEraser}
                id="clear-context"
                size="4x"
                style={{ cursor: 'pointer' }}
                onClick={handleBtnClick}
              />
            </button>
          </div>
        </form>
      </div>
      <div className={styles.pop}>
        <Image
          height={40}
          width={40}
          onClick={toggle}
          src={icon}
          alt="Questions and Answers Icon"
          style={{ height: 40, width: 40 }}
        />
      </div>
    </div>
  );
};

export default Chat;
