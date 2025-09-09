import styles from './List.module.css';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ListHeader, ListFooter, ListItem }  from '@/components';
import type { TItem, TListFilter } from '@/types';


const SHORT_ANIMATION_DELAY_MS = 100;
const LIST_ANIMATION_DURATION_MS = 1250;

const LIST_DESTRUCTION_DELAY = LIST_ANIMATION_DURATION_MS + 1000;

interface IListProps {
  items: TItem[],
  activeItemsCount: number,
  activeFilter: TListFilter
}

export const List: React.FC<IListProps> = ({ items, activeItemsCount, activeFilter }) => {
  const [listsArray, setListsArray] = useState([{ id: 0, items: items, visible: 0 }]);
  const listsArrayRefs = useRef<{ [key: string]: HTMLUListElement | null }>({ [(0).toString()]: null });

  const footerContainerRef = useRef<HTMLDivElement>(null);

  const itemsCopy = useRef<TItem[]>(JSON.parse(JSON.stringify(items)));

  const prevListHeight = useRef(0);
  const [footerHeightDiffCurrent, setFooterHeightDiffCurrent] = useState(0);
  const [footerAnimating, setFooterAnimating] = useState(true);

  function showLastListDelayed() {
    setTimeout(() => {
      setListsArray(prevLists => prevLists.map((list, index) => {
        if (index === prevLists.length - 1) {
          return {...list, visible: 1};
        }
        return list;
      }));
    }, SHORT_ANIMATION_DELAY_MS);
  };

  useEffect(() => {
    showLastListDelayed();
  }, []);


  // List animation
  useEffect(() => {
    const lastListId = listsArray[listsArray.length - 1].id;
    const lastList = listsArrayRefs.current[lastListId.toString()];

    if (!lastList) return;

    function checkListStructureChange() {
      if (items.length !== itemsCopy.current.length) {
        return true;
      }
      for (let i = 0; i < items.length; i++) {
          if (items[i].id !== itemsCopy.current[i].id) {
              return true;
          }
      }
      return false;
    }
    
    if (checkListStructureChange()) {
      //Add new list, fade out old list
      setListsArray(prevLists => {
        const updatedLists = prevLists.map(list => {
          return {...list, visible: -1 };
        });
        const newId = prevLists[prevLists.length - 1].id + 1;
        const newItems = JSON.parse(JSON.stringify(items));
        const newList = { id: newId, items: newItems, visible: 0 };

        showLastListDelayed();

        return [...updatedLists, newList]
      });

      //Remove old list
      setTimeout(() => {
        setListsArray(prevLists => {
          const filteredLists = prevLists.filter(list => list.id !== lastListId);
          delete listsArrayRefs.current[lastListId.toString()];
          return filteredLists;
        });
      }, LIST_DESTRUCTION_DELAY);

    } else {
      //Only texts and checkboxes update
      setListsArray(prevLists => prevLists.map((list, index) => {
        if (index === prevLists.length - 1) {
          return {...list, items: items};
        }
        return list;
      }));
    }

    itemsCopy.current = JSON.parse(JSON.stringify(items));

  }, [items, activeFilter]);


  //Footer animation
  useLayoutEffect(() => {
    const footerContainer = footerContainerRef.current;
    const lastListId = listsArray[listsArray.length - 1].id;
    const lastList = listsArrayRefs.current[lastListId.toString()];

    if (!lastList || !footerContainer) return;

    const newListHeight = lastList.getBoundingClientRect().height;
    const oldListHeight = prevListHeight.current;
    const heightDiff = newListHeight - oldListHeight;

    if (heightDiff !== 0) {
      const currentTransform = window.getComputedStyle(footerContainer).transform;
      const matrix = new DOMMatrix(currentTransform);
      const currentTranslateY = matrix.m42;

      setFooterHeightDiffCurrent(heightDiff - currentTranslateY);
      setFooterAnimating(false);

      setTimeout(() => {
        setFooterAnimating(true);
        setFooterHeightDiffCurrent(0);
      }, SHORT_ANIMATION_DELAY_MS);

      prevListHeight.current = newListHeight;
    }
  }, [listsArray]);


  return (
    <div className={styles['list-container']}>
      <ListHeader />
      {listsArray.map((list) => (
        <ul
          key={list.id}
          className={
            `${styles.list} ` +
            `${list.visible === 1 ? styles['list-show'] : ''}` +
            `${list.visible === -1 ? styles['list-hide'] : ''}`
          }
          ref={el => {
            listsArrayRefs.current[list.id.toString()] = el;
          }}
        >
          {list.items.map((item) => (
            <ListItem key={item.id} {...item} />
          ))}
        </ul>
      ))}
      <div
        className={
          `${styles['footer-container']} ${footerAnimating ? styles['footer-container-animating'] : ''}`
        }
        ref={footerContainerRef}
        style={{ transform: `translateY(${-footerHeightDiffCurrent}px)` }}
      >
        <ListFooter
          activeItemsCount={activeItemsCount}
          activeFilter={activeFilter}
        />
      </div>
    </div>
  );
};
