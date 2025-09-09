import styles from './ListHeader.module.css';
import { useRef, type KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import { type AppDispatch, listStore } from '@/store';


const headerPlaceholder = 'What needs to be done?';

export const ListHeader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      dispatch(listStore.actions.addItem(inputRef.current.value));
      inputRef.current.value = '';
    }
  };

  return (
    <div className={styles['list-header']}>
      <p className={styles.prefix}></p>
      <input
        className={styles.input}
        type="text"
        ref={inputRef}
        placeholder={headerPlaceholder}
        onKeyDown={handleEnter}
        maxLength={30}
      />
    </div>
  );
};
