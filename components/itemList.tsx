import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {BundleObject, FeedObject, ItemType, SelectedFeedState} from "../utils/types";
import {useQuery} from "@apollo/client";
import {BUNDLES_QUERY, FEEDS_QUERY} from "../utils/api/graphql/queries";
import {NotifyLoading} from "./notifyLoading";
import {NotifyError} from "./notifyError";
import OneListItem from "./oneListItem";

const ItemList = ({
                    type,
                    selected,
                    setSelected,
                    useSelected = false,
                    allowEdits = false,
                  }: {
  type: ItemType,
  selected?: SelectedFeedState,
  setSelected?: Dispatch<SetStateAction<SelectedFeedState>>,
  useSelected?: boolean,
  allowEdits?: boolean,
}) => {
  const isFeed = type === ItemType.FeedType;

  const {loading, error, data} = useQuery(isFeed ? FEEDS_QUERY : BUNDLES_QUERY,);
  const {feeds, bundles} = data || {};
  const itemList = isFeed ? feeds : bundles;

  //console.log(loading, error, data);
  //console.log(itemList);

  useEffect(() => {
    (async () => {
      if (useSelected && itemList && itemList.length > 0 && selected.id === null) {
        const firstItem = itemList[0];
        await setSelected({
          id: firstItem.id,
          feeds: isFeed ? [firstItem] : firstItem['feeds'],
          editMode: false,
          newMode: false,
        });
      }
    })();
  });

  if (loading) {
    return <NotifyLoading/>
  }

  if (error) {
    return <NotifyError/>
  }

  return (
    <>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        {itemList && itemList.length > 0
          ? (
            itemList.map((item: FeedObject | BundleObject) => (
                <OneListItem item={item}
                             type={type}
                             key={item.id}
                             useSelected={useSelected}
                             allowEdits={allowEdits}
                             selected={selected}
                             setSelected={setSelected}/>
              )
            )
          )
          : (<p>There are no bundles nor feeds.</p>)
        }
      </div>
    </>
  );
};

export default ItemList;