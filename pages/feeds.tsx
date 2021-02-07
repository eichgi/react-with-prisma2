import React, {useState} from 'react';
import {ItemType, SelectedFeedState} from "../utils/types";
import ItemList from "../components/itemList";
import Layout from "../components/layout";
import NewEditItem from "../components/newEditItem";
import {useFetchUser} from "../utils/user";
import {Minus, Plus} from "../components/svg";

const FeedsPage = () => {
  const {user, loading} = useFetchUser();
  const initialSelected: SelectedFeedState = {
    id: null,
    feeds: [],
    editMode: false,
    newMode: false,
  };

  const [selected, setSelected] = useState(initialSelected);

  const toggleNewMode = (e) => {
    e.persist();
    setSelected(currState => ({
      ...currState,
      newMode: !currState.newMode,
      editMode: false,
    }));
  };

  return (
    <Layout>
      <div className="grid grid-cols-2">
        <h3 className="grid-cols-1 justify-start flex text-lr font-medium py-4">Feeds Page</h3>
        {user
          ? (<div onClick={(e) => toggleNewMode(e)} className="flex grid-cols-1 justify-end cursor-pointer">
            {selected.newMode ? <Minus className={`h-6 w-6 text-${selected.newMode ? 'gray' : 'blue'}-500 mt-4`}/> :
              <Plus className={`h-6 w-6 text-${selected.newMode ? 'gray' : 'blue'}-500 mt-4`}/>}
            <h3
              className={`grid-cols-1 justify-start flex text-lg font-medium py-4 text-${selected.newMode ? 'gray' : 'blue'}`}>New
              Feed</h3>
          </div>)
          : null}
      </div>

      {
        (selected.editMode || selected.newMode) && user ? <NewEditItem type={ItemType.FeedType}/> : null
      }

      <ItemList type={ItemType.FeedType}
                useSelected={true}
                allowEdits={true}
                selected={selected}
                setSelected={setSelected}/>

    </Layout>
  );
};

export default FeedsPage;