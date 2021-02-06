import React from 'react';
import {BundleObject, FeedObject, ItemType} from "../utils/types";
import {useQuery} from "@apollo/client";
import {BUNDLES_QUERY, FEEDS_QUERY} from "../utils/api/graphql/queries";
import {NotifyLoading} from "./notifyLoading";
import {NotifyError} from "./notifyError";

const ItemList = ({type}: { type: ItemType }) => {
  const isFeed = type === ItemType.FeedType;

  const {loading, error, data} = useQuery(isFeed ? FEEDS_QUERY : BUNDLES_QUERY,);
  const {feeds, bundles} = data || {};
  const itemList = isFeed ? feeds : bundles;

  //console.log(loading, error, data);
  console.log(itemList);
  //const loading = true;
  if (loading) {
    return <NotifyLoading/>
  }

  if (error) {
    return <NotifyError/>
  }

  return (
    <>
      <div className="grid lg:grod-cols-3 md:grid-cols-2 gap-4">
        {itemList.length > 0
          ? (
            itemList.map((item: FeedObject | BundleObject) => (<p key={item.id}>{item.name}</p>))
          )
          : (<p>There are no bundles nor feeds.</p>)
        }
      </div>
    </>
  );
};

export default ItemList;