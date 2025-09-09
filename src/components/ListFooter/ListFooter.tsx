import styles from './ListFooter.module.css';
import { useDispatch } from 'react-redux';
import type { TListFilter } from '@/types';
import { type AppDispatch, listStore } from '@/store';


interface IListFooterProps {
  activeItemsCount: number,
  activeFilter: TListFilter
}

export const ListFooter: React.FC<IListFooterProps> = ({ activeItemsCount, activeFilter }) => {
  const dispatch = useDispatch<AppDispatch>();

  function setFilter(filter: TListFilter) {
    dispatch(listStore.actions.setFilter(filter));
  }

  function deleteCompletedItems() {
    dispatch(listStore.actions.deleteCompletedItems());
    if (activeFilter === 'completed') setFilter('all');
  }

  return (
    <div className={styles.footer}>
      <button
        className={`${styles.button} ${styles['button-left']}`}
        onClick={() => setFilter('active')}
      >
        {activeItemsCount}{' item' + (activeItemsCount !== 1 ? 's' : '') + ' left'}
      </button>
      <div>
        <button
          className={`${styles.button} ${activeFilter === 'all' ? styles['filter-active'] : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`${styles.button} ${activeFilter === 'active' ? styles['filter-active'] : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`${styles.button} ${activeFilter === 'completed' ? styles['filter-active'] : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      <button
        className={`${styles.button} ${styles['button-right']}`}
        onClick={deleteCompletedItems}
      >
        Clear completed
      </button>
    </div>
  );
};
