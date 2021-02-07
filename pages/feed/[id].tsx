import React from 'react';
import {useQuery} from "@apollo/client";
import {FEED_QUERY} from "../../utils/api/graphql/queries";
import Layout from "../../components/layout";
import {NotifyLoading} from "../../components/notifyLoading";
import {NotifyError} from "../../components/notifyError";
import {BundleObject, ItemType} from "../../utils/types";
import OneListItem from "../../components/oneListItem";

const Feed = ({id}) => {

  const {loading, error, data} = useQuery(FEED_QUERY, {
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

  const {feed} = data || {};

  return (
    <Layout>
      <h3 className="text-lg font-medium pt-4 ">{feed.name}</h3>
      <p className="pb-4">{feed.url}</p>
      <h3 className="pb-4 font-medium">Bundles</h3>
      <div className="grid grid-cols-3 gap-4">
        {feed.bundles.length > 0
          ? feed.bundles.map((item: BundleObject) => (
            <OneListItem key={item.id} item={item} type={ItemType.BundleType}/>
          ))
          : <p>There are no bundles.</p>}
      </div>
    </Layout>
  );
};

Feed.getInitialProps = ({query}) => {
  const {id} = query;

  return {id};
};

export default Feed;