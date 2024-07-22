import { useMessages } from '@store/useMessages';
import styles from './index.module.scss'
import { MessageSend } from '@backend/entity/MessageSend';
import { useCallback, useEffect, useState } from 'react';
import { MdSend } from 'react-icons/md';


export const Input = () => {
    const { onSend, chatId, clearMessages } = useMessages();
    const [message, setMessage] = useState('');
    const sendMessage = useCallback((text: string) => {
        if (!text) return;
        setMessage('');
        const message = new MessageSend(chatId);
        message.text = text;
        onSend(message);
    }, [chatId, onSend]);
    useEffect(() => {
        const enterKey = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                sendMessage(message);
                setMessage('');
            }
        }
        window.addEventListener('keydown', enterKey);
        return () => window.removeEventListener('keydown', enterKey);

    }, [message, sendMessage])
    useEffect(() => {
        return () => {
            clearMessages();
        }
    }, [clearMessages])
    return (
        <div className={styles.container}>
            <form onSubmit={(e) => sendMessage(message)}>
                <input
                    className={styles.input}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className={styles.button}
                    onClick={() => {
                        sendMessage(message);
                    }}
                >
                    <MdSend />
                </button>
            </form>

        </div>
    )
}