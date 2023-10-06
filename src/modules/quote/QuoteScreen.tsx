import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../core/store";

import * as presenter from "./quotes-presenter";

export const QuoteScreen = () => {
  const [count, setCount] = useState(7);
  const countRef = useRef(count);

  const [isPaused, setIsPaused] = useState(false);

  const dispatch = useAppDispatch();

  const quoteVm = useAppSelector(presenter.selectQuoteVm);
  const quoteStatus = useAppSelector(presenter.selectQuoteStatus);

  const loadRandomQuote = () => {
    dispatch<any>(presenter.loadQuote());
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    loadRandomQuote();
  }, []);

  useEffect(() => {
    const countdownQuote = setInterval(() => {
      if (isPaused) {
        return null;
      }

      if (countRef.current < 1) {
        console.log("hit");
        loadRandomQuote();

        setCount(8);
      } else {
        setCount((prevCount) => prevCount - 1);
      }
    }, 1000);

    return () => clearInterval(countdownQuote);
  }, [isPaused]);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  console.log("quoteStatus: ", quoteStatus);

  const isLoading = quoteStatus === "LOADING";
  const onFailure = quoteStatus === "FAILURE";
  const onSuccess = quoteStatus === "SUCCESS";

  return (
    <main>
      {isLoading && (
        <article>
          <p>Loading random quote...</p>
        </article>
      )}
      {onFailure && (
        <article>
          <p>We could not get the quote. Please try again later.</p>

          <button onClick={() => loadRandomQuote()}>Try again</button>
        </article>
      )}
      {onSuccess && (
        <article>
          <q>{quoteVm?.quote}</q>
          <p>- {quoteVm?.author}</p>
          <button onClick={() => loadRandomQuote()}>Get a quote!</button>
        </article>
      )}
      <button
        onClick={() => togglePause()}
        style={{
          position: "absolute",
          bottom: "0.5rem",
          right: "0.5rem",
        }}
      >
        {isPaused ? "||" : ">"} {count}
      </button>
    </main>
  );
};
