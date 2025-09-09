import styles from './ListItem.module.css';
import { useRef, type KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import type { TItem } from '@/types';
import { type AppDispatch, listStore } from '@/store';


export const ListItem: React.FC<TItem> = ({ id, completed, text }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleInput = () => {
    if (inputRef.current) {
      dispatch(listStore.actions.setItemText({id, text: inputRef.current.value}));
    }
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      inputRef.current.blur()
    }
  };

  return (
    <li className={styles['list-item']}>
      <button
        className={`${styles.button} ${completed ? styles['task-completed'] : ''}`}
        onClick={() => {dispatch(listStore.actions.changeItemState(id));}}
      >
        {'\u2713'}
      </button>
      <input
        className={`${styles.input} ${completed ? styles['task-completed'] : ''}`}
        type="text"
        ref={inputRef}
        defaultValue={text}
        onChange={handleInput}
        onKeyDown={handleEnter}
        maxLength={30}
      >
      </input>
    </li>
  );
};
