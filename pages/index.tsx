import Layout from "../components/layout";
import ItemList from "../components/itemList";
import {ItemType} from "../utils/types";

const Index = () => {
  return (
    <Layout>
      <h3 className="justify-start flex text-lg font-medium py-4">Home page</h3>

      <ItemList type={ItemType.BundleType}/>
    </Layout>
  );
};

export default Index;