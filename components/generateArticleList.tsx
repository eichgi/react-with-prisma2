import React, {useEffect, useState} from 'react';
import {Feed} from '@prisma/client';
import * as _ from 'lodash';
import {NotifyLoading} from "./notifyLoading";
import {NotifyError} from "./notifyError";
import ArticleList from "./articleList";

const Parser = require('rss-parser');
const parser = new Parser();

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

const GenerateArticleList = ({feeds}: { feeds: Feed[] }) => {
  const [{loading, error, data}, setGet] = useState({error: false, loading: true, data: []});

  useEffect(() => {
    (async () => {
      try {
        const fetchedItems = _.reduce(
          await Promise.all(
            feeds.map(async oneFeed => {
              const {items} = await parser.parseURL(CORS_PROXY + oneFeed.url);
              //const {items} = await parser.parseURL(oneFeed.url);
              //console.log(items);

              return items.map(o => ({...o, feed: oneFeed}));
            })
          ), (sum, n) => [...sum, ...n]);

        //console.log(fetchedItems);

        setTimeout(() => {
          setGet(o => ({...o, data: fetchedItems, loading: false}));
        }, 1);
      } catch (error) {
        console.log(error);
        setGet(o => ({...o, error, loading: false}));
      }
    })();
  }, [feeds]);

  if (loading) {
    return <NotifyLoading/>;
  }

  if (error) {
    return <NotifyError/>
  }

  return (
    <ArticleList articleList={data}/>
  );
};

export default GenerateArticleList;