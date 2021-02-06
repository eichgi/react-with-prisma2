import React from 'react';
import {ErrorSign} from "./svg";

export const NotifyLoading = () => {
  return (
    <div className="h-screen flex">
      <ErrorSign className="h-10 w-10 text-gray-500 m-auto"/>
    </div>
  );
};