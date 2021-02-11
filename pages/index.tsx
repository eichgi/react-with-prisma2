import Layout from "../components/layout";
import ItemList from "../components/itemList";
import {ItemType, SelectedFeedState} from "../utils/types";
import {useState} from "react";
import GenerateArticleList from "../components/generateArticleList";

const Index = () => {

  const initialSelected: SelectedFeedState = {
    id: null,
    feeds: [],
    editMode: false,
    newMode: false,
  };

  const [selected, setSelected] = useState(initialSelected);

  return (
    <Layout>
      <h3 className="justify-start flex text-lg font-medium py-4">Home page</h3>

      <ItemList
        selected={selected}
        setSelected={setSelected}
        useSelected={true}
        type={ItemType.BundleType}/>

      {selected.feeds.length > 0
        ? <GenerateArticleList feeds={selected.feeds}/>
        : <h3>No bundles</h3>}
    </Layout>
  );
};

export default Index;