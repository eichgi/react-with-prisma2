import React, {Dispatch, SetStateAction, useState} from 'react';
import {ActionType, BadgeFieldName, BundleObject, FeedObject, SearchQueryName} from "../utils/types";
import {DocumentNode} from "graphql";
import {Search, Spin} from "./svg";
import {useLazyQuery} from "@apollo/client";
import BadgeList from "./badgeList";
import * as _ from 'lodash';

const SearchItems = ({
                       currentItem, setItem, queryName, query, fieldName,
                     }: {
  currentItem: FeedObject | BundleObject,
  setItem: Dispatch<SetStateAction<FeedObject | BundleObject>>,
  queryName: SearchQueryName,
  query: DocumentNode,
  fieldName: BadgeFieldName,
}) => {
  const [search, setSearch] = useState('');
  const [findItemsQuery, {loading, data, called}] = useLazyQuery(query, {fetchPolicy: "network-only"});

  console.log(loading, data, called);

  const fetchedItems = _.get(data, queryName);
  const filterFindItems = fetchedItems
    ? fetchedItems.filter(item => !currentItem[fieldName].map(o => o.name).includes(item.name))
    : [];

  const matchCurrent = filterFindItems.filter(o => o.name === search);
  const matchList = currentItem[fieldName].filter(o => o.name === search);
  const filterFindItemsWithAdd = matchCurrent.length === 0 && matchList.length === 0 && queryName !== 'findFeeds'
    ? [...filterFindItems, {name: search}]
    : filterFindItems;

  const dummyNewItem = {
    ...currentItem,
    [fieldName]: filterFindItemsWithAdd,
  };

  const onChangeHandler = (e) => {
    e.persist();
    if (e.target.value !== search) {
      setSearch(() => e.target.value);
      findItemsQuery({variables: {data: {search: e.target.value}}});
    }
  };

  return (
    <>
      <div className="flex">
        {loading
          ? <Spin className="h-6 w-6 text-gray-500 animate-spin"/>
          : <Search className="mt-3 mr-2 w-6 h-6 text-gray-500"/>}

        <input type="text" className="border-4 rounded w-full py-2 px-3"
               value={search}
               onChange={e => onChangeHandler(e)}/>
      </div>
      <div className="grid grid-cols-3 gap-2 flex m-2">
        {search !== ""
          ? <BadgeList fieldName={fieldName} action={ActionType.ADD} setItem={setItem} item={dummyNewItem}/>
          : called
            ? <p className="text-gray-400">No matches</p>
            : null
        }
      </div>
    </>
  );
};

export default SearchItems;