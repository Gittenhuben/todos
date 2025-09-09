import { useSelector } from 'react-redux';
import { Header, List } from '@/components';
import { listStore } from '@/store';

function App() {
  const activeItemsCount = useSelector(listStore.selectActiveItemsCount);
  const filteredItems = useSelector(listStore.selectFilteredListItems);
  const activeFilter = useSelector(listStore.selectListFilter);

  return (
    <>
      <Header/>
      <List
        items={filteredItems}
        activeItemsCount={activeItemsCount}
        activeFilter={activeFilter}
      />
    </>
  )
}

export default App
