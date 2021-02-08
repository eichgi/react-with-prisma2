import React, {Dispatch, SetStateAction} from 'react';
import {ActionType, BadgeFieldName, BundleObject, FeedObject} from "../utils/types";
import {BundleTag, FeedTag} from '@prisma/client';
import {Minus, Plus} from "./svg";

const OneBadge = (
  {item, action, currentItem, fieldName, setItem}:
    {
      item: FeedTag | BundleTag | FeedObject,
      action: ActionType,
      currentItem?: FeedObject | BundleObject,
      fieldName: BadgeFieldName,
      setItem?: Dispatch<SetStateAction<FeedObject | BundleObject>>
    }) => {
  const color = fieldName === BadgeFieldName.tags ? 'blue' : fieldName === BadgeFieldName.feeds ? 'green' : 'purple';

  const addClickHandler = () => {
    setItem((currentState) => ({
      ...currentState,
      [fieldName]: [
        ...currentState[fieldName],
        {...item}
      ],
    }));
  };

  const createClickHandler = () => {
    setItem((currentState) => ({
      ...currentState,
      [fieldName]: currentState[fieldName].filter(o => item.name !== o.name),
    }));
  };

  return (
    <div className="inline-block align-middle">
      <span className={`flex justify-center text-sm p-2 rounded-lg bg-${color}-200`}>
        {action === ActionType.ADD
          ? (
            <div onClick={() => addClickHandler()}>
              <Plus className="h-4 w-4 text-gray-500"/>
            </div>
          )
          : null}
        {action === ActionType.CREATE
          ? (
            <div onClick={() => createClickHandler()}>
              <Minus className="h-4 w-4 text-gray-500"/>
            </div>
          )
          : null}
        <p className={`text-xs text-${color}-600 text-center`}>{item.name}</p>
      </span>
    </div>
  );
};

export default OneBadge;