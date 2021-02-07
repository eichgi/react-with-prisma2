import React, {Dispatch, SetStateAction} from 'react';
import {BundleObject, FeedObject} from "../utils/types";

const GenerateInputField = ({
                              currentItem,
                              name,
                              changeHandler,
                            }: {
  name: string,
  currentItem: FeedObject | BundleObject,
  changeHandler: Dispatch<SetStateAction<FeedObject> | BundleObject>,
}) => {
  const onChangeHandler = (e) => {
    e.persist();
    changeHandler(current => ({
      ...current,
      [name]: e.target.value,
    }))
  };

  return (
    <div className='py-2'>
      <label className="block py-2">{name.charAt(0).toUpperCase() + name.slice(1)}</label>
      <input className="border-4 rounded w-full py-2 px-3" value={currentItem[name]}
             onChange={e => onChangeHandler(e)}/>
    </div>
  );
};

export default GenerateInputField;