import React, {useState} from 'react';
import Pagination from 'react-js-pagination';
import OneArticle from "./oneArticle";

const ArticleList = ({articleList}) => {

  const [currentPagination, setCurrentPagination] = useState({currentPage: 1, articlesPerPage: 8});
  const {currentPage, articlesPerPage} = currentPagination;
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articleList.slice(indexOfFirstArticle, indexOfLastArticle);

  const onPaginationHandler = (clickedNumber) => {
    setCurrentPagination((currentState) => (
      {
        ...currentState,
        currentPage: parseInt(clickedNumber),
      })
    );
  };

  return (
    <>
      <h3 className="py-4 font-medium text-lg">Articles</h3>
      <div className="grid grid-cols-1 gap-4">
        {currentArticles.map(({feed, ...oneArticle}) => (
          <OneArticle article={oneArticle} feed={feed} key={oneArticle.title}/>
        ))}
        <Pagination activePage={currentPage} innerClass="rounded py-2 px-2 flex"
                    itemClass="px-2"
                    itemCountsPerPage={articlesPerPage}
                    totalItemsCount={articleList.length}
                    pageRangeDisplayed={5}
                    onChange={clickedNumber => onPaginationHandler(clickedNumber)}/>
      </div>
    </>
  );
};

export default ArticleList;