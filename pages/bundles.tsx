import React, {useState} from 'react';
import Layout from "../components/layout";
import ItemList from "../components/itemList";
import {ItemType, SelectedFeedState} from "../utils/types";

const BundlesPage = () => {

  const initialSelected: SelectedFeedState = {
    id: null,
    feeds: [],
    editMode: false,
    newMode: false,
  };

  const [selected, setSelected] = useState(initialSelected);

  return (
    <Layout>
      <div className="grid grid-cols-2">
        <h3 className="grid-cols-1 justify-start flex text-lr font-medium py-4">Bundles Page</h3>
      </div>

      <ItemList type={ItemType.BundleType}
                useSelected={true}
                allowEdits={true}
                selected={selected}
                setSelected={setSelected}/>

    </Layout>
  );
};

export default BundlesPage;