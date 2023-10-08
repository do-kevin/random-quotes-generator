import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../core/store";

import * as presenter from "./quotes-presenter";

export const QuoteScreen = () => {
  const [count, setCount] = useState(7);
  const countRef = useRef(count);

  const [isPaused, setIsPaused] = useState(true);

  const [showWipe, setShowWipe] = useState<boolean>(true);

  const [containerTheme, setContainerTheme] = useState("bg-white");
  const [wipeTheme, setWipeTheme] = useState("quote-container--red");

  const [themeCount, setThemeCount] = useState<number>(0);

  const dispatch = useAppDispatch();

  const quoteVm = useAppSelector(presenter.selectQuoteVm);

  const quoteStatus = useAppSelector(presenter.selectQuoteStatus);

  const getRandomIndex = (arr: unknown[]) => {
    return Math.floor(Math.random() * arr.length);
  };

  const loadRandomQuote = () => {
    if (themeCount === 0) {
      setWipeTheme("quote-container--red");
    }

    if (themeCount === 1) {
      setWipeTheme("quote-container--purple");
    }

    setShowWipe(true);

    dispatch<any>(presenter.loadQuote());

    setTimeout(() => {
      setShowWipe(false);
      if (themeCount === 0) {
        setContainerTheme("bg-red");
      }

      if (themeCount === 1) {
        setContainerTheme("bg-purple");
      }

      setThemeCount(themeCount + 1);

      if (themeCount === 1) {
        setThemeCount(0);
      }
    }, 1200);
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

  const isLoading = quoteStatus === "LOADING";
  const onFailure = quoteStatus === "FAILURE";
  const onSuccess = quoteStatus === "SUCCESS";

  const quoteCardStyles: React.CSSProperties = {
    margin: "auto",
    textAlign: "center",
    background: "white",
    padding: "1rem",
    borderRadius: "10px",
    maxWidth: "40rem",
    color: "#242424",
    zIndex: 1,
  };

  const quoteBtnStyles: React.CSSProperties = {
    background: "#5dc55d",
    color: "white",
    zIndex: 1,
  };

  return (
    <main
      className={`quotecontainer ${
        showWipe && "diagonal-wipe"
      } ${containerTheme} ${wipeTheme}`}
    >
      {isLoading && (
        <article style={quoteCardStyles}>
          <p>Loading random quote...</p>
        </article>
      )}
      {onFailure && (
        <article style={quoteCardStyles}>
          <p>We could not get the quote. Please try again later.</p>

          <button style={quoteBtnStyles} onClick={() => loadRandomQuote()}>
            Try again
          </button>
        </article>
      )}
      {onSuccess && (
        <article style={quoteCardStyles}>
          <blockquote style={{ fontWeight: "bold" }}>
            {quoteVm?.quote}
            <footer style={{ fontWeight: 400 }}>- {quoteVm?.author}</footer>
          </blockquote>

          <button
            style={quoteBtnStyles}
            onClick={() => {
              setIsPaused(true);
              loadRandomQuote();
            }}
          >
            Get a quote!
          </button>
        </article>
      )}
      <aside
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          zIndex: 1,
        }}
      >
        <p
          style={{
            background: "white",
            marginBottom: "0.5rem",
            textAlign: "center",
            padding: "0.5rem",
            borderRadius: "10px",
            color: "#242424",
          }}
        >
          Showing next quote in {count}
        </p>
        <button onClick={() => togglePause()}>
          {isPaused ? "| | Pause" : "|> Play"}
        </button>
      </aside>
    </main>
  );
};
