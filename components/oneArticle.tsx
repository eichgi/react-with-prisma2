import React from 'react';
import {Feed} from '@prisma/client';
import {stripHtml} from 'string-strip-html';
import {HeartOutline, SingleArrowRight, WaitingClock} from "./svg";
import {useMutation, useQuery} from "@apollo/client";
import {ME_QUERY, SAVED_ARTICLE_QUERY} from "../utils/api/graphql/queries";
import {useFetchUser} from "../utils/user";
import {CREATE_SAVED_ARTICLE_MUTATION, DELETE_SAVED_ARTICLE_MUTATION} from "../utils/api/graphql/mutations";
import * as _ from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {updateSavedArticleCache} from "../utils/update";

const OneArticle = (
  {
    article,
    feed
  }: {
    article,
    feed: Feed
  }
) => {
  const cleanContent = stripHtml(article.content);

  const variables = {data: {url: article.link}};
  const {loading: savedArticleLoading, error, data} = useQuery(SAVED_ARTICLE_QUERY, {variables})
  const {user, loading: userLoading} = useFetchUser();
  const {data: meData, loading: userLoadingQuery} = useQuery(ME_QUERY);
  const [createSavedArticleMutation, {loading: createSavedArticleLoading}] = useMutation(CREATE_SAVED_ARTICLE_MUTATION);
  const [deleteSavedArticleMutation, {loading: deleteSavedArticleLoading}] = useMutation(DELETE_SAVED_ARTICLE_MUTATION);

  const loading = savedArticleLoading || userLoading || userLoadingQuery || deleteSavedArticleLoading;

  if (loading) {
    return <WaitingClock className="h-8 w-8"/>
  }

  const savedArticle = _.get(data, 'savedArticle');

  console.log(savedArticle);

  const onSavedArticleHandler = async (e) => {
    e.stopPropagation();
    if (user && !loading) {
      if (savedArticle) {
        const deleteSavedArticle = {data: {id: savedArticle.id}};
        await deleteSavedArticleMutation({
          variables: deleteSavedArticle,
          update: updateSavedArticleCache('delete'),
          optimisticResponse: () => {
            return {
              __typename: 'Mutation',
              ['deleteSavedArticle']: {
                ...deleteSavedArticle.data,
                __typename: 'SavedArticle',
              }
            }
          },
        });
      } else {
        const newSavedArticle = {
          data: {
            id: uuidv4(),
            url: article.link,
            content: article,
            feed: {
              connect: {
                id: feed.id,
              }
            }
          }
        };

        await createSavedArticleMutation({
          variables: newSavedArticle,
          update: updateSavedArticleCache('create'),
          optimisticResponse: () => {
            const user = _.get(meData, 'me');

            return {
              __typename: 'Mutation',
              ['createSavedArticle']: {
                ...newSavedArticle.data,
                user,
                feed,
                __typename: 'SavedArticle',
              }
            }
          },
        })
      }
    }
  }

  return (
    <div className="grid grid-cols-12 rounded-lg py-4 px-4 border-4 border-gray-300">

      <div className="col-span-1 flex items-center justify-center z-10 cursor-pointer"
           onClick={e => onSavedArticleHandler(e)}>
        <HeartOutline
          className={`h-8 w-8 ${!_.isNull(savedArticle) ? 'text-red-500' : 'text-gray-500'} inline-block align-middle`}/>
      </div>

      <div className="col-span-10">
        <h4 className="font-bold">{article.title}</h4>
        {article.creator
          ? <p className="col-span-6">{article.creator}</p>
          : null}
        <p className="">{cleanContent.result}</p>
      </div>

      <div className="col-span-1 flex items-center justify-end">
        <a href={article.link} target="_blank">
          <SingleArrowRight className="h-8 w-8 text-blue-500 inline-block align-middle"/>
        </a>
      </div>
    </div>
  );
};

export default OneArticle;