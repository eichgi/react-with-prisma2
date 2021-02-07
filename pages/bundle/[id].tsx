import React from 'react';
import {useQuery} from "@apollo/client";
import {BUNDLE_QUERY} from "../../utils/api/graphql/queries";
import {NotifyLoading} from "../../components/notifyLoading";
import Layout from "../../components/layout";
import {NotifyError} from "../../components/notifyError";
import {FeedObject, ItemType} from "../../utils/types";
import OneListItem from "../../components/oneListItem";

const Bundle = ({id}) => {

  const {loading, error, data} = useQuery(BUNDLE_QUERY, {
    variables: {
      data: {id},
    }
  });

  if (loading) {
    return (<Layout>
      <NotifyLoading/>
    </Layout>);
  }

  if (error) {
    return (<Layout>
      <NotifyError/>
    </Layout>);
  }

  //console.log(loading, error, data);

  const {bundle} = data || {};

  return (
    <Layout>
      <h3 className="text-lg font-medium pt-4 ">{bundle.name}</h3>
      <p className="pb-4">{bundle.description}</p>
      <h3 className="pb-4 font-medium">Feeds</h3>
      <div className="grid grid-cols-3 gap-4">
        {bundle.feeds.length > 0
          ? bundle.feeds.map((item: FeedObject) => (
            <OneListItem key={item.id} item={item} type={ItemType.FeedType}/>
          ))
          : <p>There are no feeds.</p>}
      </div>
    </Layout>
  );
};

Bundle.getInitialProps = ({query}) => {
  const {id} = query;
  //console.log(query);

  return {id};
};

export default Bundle;