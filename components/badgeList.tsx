import React, {Dispatch, SetStateAction} from 'react';
import {ActionType, BadgeFieldName, BundleObject, FeedObject} from "../utils/types";
import OneBadge from "./oneBadge";

const BadgeList = ({
                     fieldName,
                     action,
                     setItem,
                     item
                   }: {
  fieldName: BadgeFieldName,
  action: ActionType,
  item: FeedObject | BundleObject,
  setItem?: Dispatch<SetStateAction<FeedObject | BundleObject>>
}) => {
  //console.log(fieldName, item, item[fieldName]);
  return (
    item[fieldName] && item[fieldName].length > 0
      ? <>
        {item[fieldName].map(oneBadge => (
          <OneBadge key={`${item.id}-${oneBadge.name}`}
                    fieldName={fieldName}
                    item={oneBadge}
                    action={action}
                    setItem={setItem}
                    currentItem={item}/>
        ))}
      </>
      : <p className="text-gray-400">Nothing found</p>
  );
};

export default BadgeList;