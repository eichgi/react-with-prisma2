import {NewItemState} from "./types";
import {v4 as uuidv4} from 'uuid';

const genNestedItem = (currentItem) => {
  const tags =
    'tags' in currentItem ? {
      tags: {
        connect: currentItem.tags
          .map(({id}) => ({id}))
          .filter(({id}) => id !== undefined),
        create: currentItem.tags
          .filter(({id}) => id === undefined)
          .map((o) => ({...o, id: uuidv4()})),
      }
    } : {};

  const feeds =
    'feeds' in currentItem ? {
      feeds: {
        connect: currentItem.feeds
          .map(({id}) => ({id}))
          .filter(({id}) => id !== undefined),
      }
    } : {};

  const {__typename, likes, author, ...cleanedItem} = currentItem;

  return {...cleanedItem, ...tags, ...feeds};
};

export const prepareNewUpdateObject = (currentItem) => {
  const currentData = genNestedItem(currentItem);

  return {...currentData, id: uuidv4()}
}