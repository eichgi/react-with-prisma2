import React from 'react';
import Layout from "../components/layout";
import ArticleList from "../components/articleList";
import {useQuery} from "@apollo/client";
import {SAVED_ARTICLES_QUERY} from "../utils/api/graphql/queries";
import {NotifyLoading} from "../components/notifyLoading";
import {NotifyError} from "../components/notifyError";

const SavedArticles = () => {

  const {loading, error, data} = useQuery(SAVED_ARTICLES_QUERY);
  //console.log(loading, error, data);

  if (loading) {
    return (
      <Layout>
        <NotifyLoading/>
      </Layout>
    )
  }

  const {savedArticles} = data || {};

  if (error || !savedArticles) {
    return (
      <Layout>
        <NotifyError/>
      </Layout>
    )
  }

  const articleList = savedArticles.map(({content, feed}) => ({...content, ...feed}));

  return (
    <Layout>
      <ArticleList articleList={articleList}/>
    </Layout>
  );
};

export default SavedArticles;