import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
  ActionType,
  BadgeFieldName,
  BundleObject,
  FeedObject,
  ItemType,
  NewItemState,
  SearchQueryName,
  SelectedFeedState
} from "../utils/types";
import {useMutation, useQuery} from "@apollo/client";
import {
  CREATE_BUNDLE_MUTATION,
  CREATE_FEED_MUTATION,
  UPDATE_BUNDLE_MUTATION,
  UPDATE_FEED_MUTATION
} from "../utils/api/graphql/mutations";
import {ErrorSign, WaitingClock} from "./svg";
import BadgeList from "./badgeList";
import GenerateInputField from "./generateInputField";
import SearchItems from "./searchItems";
import {
  BUNDLE_QUERY,
  FEED_QUERY,
  FIND_BUNDLE_TAGS_QUERY,
  FIND_FEED_TAGS_QUERY,
  FIND_FEEDS_QUERY,
  ME_QUERY
} from "../utils/api/graphql/queries";
import {prepareNewUpdateObject} from "../utils/prepareNewUpdateObject";
import {updateCache} from "../utils/update";
import {optimisticCache} from "../utils/optimisticCache";

const NewEditItem = (
  {
    type,
    selected,
    setSelected,
  }: {
    type: ItemType,
    selected: SelectedFeedState,
    setSelected: Dispatch<SetStateAction<SelectedFeedState>>,
  }) => {
  const isFeed = type === ItemType.FeedType;
  const initialFeed: FeedObject = {
    name: "",
    url: "",
    tags: [],
  };
  const initialBundle: BundleObject = {
    name: "",
    description: "",
    feeds: [],
    tags: [],
  };
  const initialState: NewItemState = isFeed ? initialFeed : initialBundle;

  const [currentItem, setCurrentItem] = useState<NewItemState>(initialState);
  const inputFields = isFeed ? ['name', 'url'] : ['name', 'description'];

  const [createItemMutation, {
    loading: createLoading,
    error: createError
  }] = useMutation(isFeed ? CREATE_FEED_MUTATION : CREATE_BUNDLE_MUTATION);

  const [updateItemMutation, {
    loading: updateLoading, error: updateError
  }] = useMutation(isFeed ? UPDATE_FEED_MUTATION : UPDATE_BUNDLE_MUTATION);

  const variables = {data: {id: selected.id || ''}};
  const {
    loading: itemQueryLoading,
    error: itemQueryError,
    data: itemQueryData
  } = useQuery(isFeed ? FEED_QUERY : BUNDLE_QUERY, {variables});

  const {loading: meLoading, error: meError, data: meData} = useQuery(ME_QUERY);
  const {bundle, feed} = itemQueryData || {};
  const item = isFeed ? feed : bundle;

  useEffect(() => {
    (async () => {
      if (item && selected.editMode) {
        const {__typename, likes, author, ...cleanedItem} = item;
        setCurrentItem({...cleanedItem});
      } else {
        setCurrentItem(initialState);
      }
    })();
  }, [itemQueryData]);

  if (createLoading || updateLoading || itemQueryLoading || meLoading) {
    return <WaitingClock className="my-20 h-10 w-10 text-gray-500 m-auto"/>
  }

  if (createError || updateError || itemQueryError || meError) {
    return <ErrorSign className="my-20 h-10 w-10 text-gray-500 m-auto"/>
  }

  //console.log(itemQueryData);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const data = prepareNewUpdateObject(item, currentItem, isFeed, selected.editMode);
    //console.log(data);

    selected.editMode
      ? await updateItemMutation({
        variables: {data},
        //update: updateCache(isFeed, 'update'),
        optimisticResponse: optimisticCache(isFeed, 'update', data, currentItem, meData),
      })
      : await createItemMutation({
        variables: {data},
        update: updateCache(isFeed, 'create'),
        optimisticResponse: optimisticCache(isFeed, 'create', data, currentItem, meData),
      });

    await setCurrentItem(initialState);
    setSelected((currentState) => ({
      ...currentState,
      editMode: false,
      newMode: false,
    }));
  };

  return (
    <>
      <form action="" onSubmit={e => onSubmitHandler(e)}>
        <div className="grid grid-cols-12 gap-4 rounded-md border-4 py-2 px-4">
          <h3 className="col-span-12 text-lg font-medium py-2">
            {`${selected.editMode ? 'Edit' : 'New'} ${isFeed ? 'Feed' : 'Bundle'}`}
          </h3>

          <div className="col-span-6">
            {inputFields.map(name => (
              <GenerateInputField key={`${type}-${name}`} name={name} currentItem={currentItem}
                                  changeHandler={setCurrentItem}/>
            ))}

            <div className={`py-4 ${isFeed ? null : 'pt-28'}`}>
              <input type="submit"
                     className={`py-4 bg-${isFeed ? 'green' : 'purple'}-400 hover:bg-${isFeed ? 'green' : 'purple'}-700 text-white font-bold px-12 rounded`}/>
            </div>
          </div>

          <div className="col-span-6">
            <div className="py-2">
              <label className="block py-2">Tags: </label>
              <div className="grid grid-cols-3 gap-2">
                <BadgeList fieldName={BadgeFieldName.tags}
                           action={ActionType.CREATE}
                           setItem={setCurrentItem}
                           item={currentItem}/>
              </div>
            </div>

            <div className="py-2">
              <label className="block py-2">Add new Tag: </label>
              <SearchItems currentItem={currentItem}
                           setItem={setCurrentItem}
                           queryName={isFeed ? SearchQueryName.findFeedTags : SearchQueryName.findBundleTags}
                           query={isFeed ? FIND_FEED_TAGS_QUERY : FIND_BUNDLE_TAGS_QUERY}
                           fieldName={BadgeFieldName.tags}/>
            </div>

            {isFeed ? null : (
              <>
                <div className="py-2">
                  <label className="block py-2">Feeds: </label>
                  <div className="grid grid-cols-3 gap-2">
                    <BadgeList fieldName={BadgeFieldName.feeds} action={ActionType.CREATE} setItem={setCurrentItem}
                               item={currentItem}/>
                  </div>
                </div>

                <div className="py-2">
                  <label className="block py-2">Add new Feed: </label>
                  <SearchItems currentItem={currentItem}
                               setItem={setCurrentItem}
                               queryName={SearchQueryName.findFeeds}
                               query={FIND_FEEDS_QUERY}
                               fieldName={BadgeFieldName.feeds}/>
                </div>
              </>
            )}
          </div>

        </div>
      </form>
    </>
  );
};

export default NewEditItem;