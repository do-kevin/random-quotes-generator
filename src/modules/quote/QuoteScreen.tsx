import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../core/store";

import * as presenter from "./quotes-presenter";

export const QuoteScreen = () => {
  const [count, setCount] = useState(7);
  const countRef = useRef(count);

  const [isPaused, setIsPaused] = useState(false);

  const [quoteClassName, setQuoteClassName] = useState(
    "font-bold font-poppins text-lg text-mint-green"
  );

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
    setCount(7);

    if (themeCount === 0) {
      setWipeTheme("quote-container--red");
      setQuoteClassName("font-bold font-poppins text-lg text-mint-green");
    }

    if (themeCount === 1) {
      setWipeTheme("quote-container--purple");
      setQuoteClassName("font-bold font-playfair text-lg text-vanilla");
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
    padding: "1rem",
    borderRadius: "10px",
    maxWidth: "80rem",
    color: "#242424",
    zIndex: 1,
  };

  const quoteBtnStyles: React.CSSProperties = {
    background: "linear-gradient(345deg, rgb(84 205 59), rgb(128 219 214)",
    color: "white",
    zIndex: 1,
    border: "none",
    fontSize: "1rem",
    padding: "1rem 2rem",
    borderRadius: "25px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow:
      "rgb(0 0 0 / 10%) 0px 10px 15px -3px, rgb(0 0 0 / 10%) 0px 4px 6px -4px",
  };

  return (
    <main
      className={`quotecontainer ${
        showWipe && "diagonal-wipe"
      } ${containerTheme} ${wipeTheme}`}
    >
      {isLoading && (
        <article style={quoteCardStyles}>
          <p className="text-lg">
            <em>Loading random quote...</em>
          </p>
        </article>
      )}
      {onFailure && (
        <article style={quoteCardStyles}>
          <p className="text-lg">
            We could not get the quote. Please try again later.
          </p>

          <button style={quoteBtnStyles} onClick={() => loadRandomQuote()}>
            Try again
          </button>
        </article>
      )}
      {onSuccess && (
        <article style={quoteCardStyles}>
          <blockquote style={{ fontWeight: "bold" }} className={quoteClassName}>
            {quoteVm?.quote}
            <footer
              className="text-md font-normal"
              style={{ marginTop: "1rem" }}
            >
              - <em>{quoteVm?.author}</em>
            </footer>
          </blockquote>

          <button
            style={quoteBtnStyles}
            onClick={() => {
              //   setIsPaused(true);
              loadRandomQuote();
            }}
          >
            Get a quote!
          </button>
        </article>
      )}
      <aside
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 1,
        }}
      >
        <button
          onClick={() => togglePause()}
          style={{
            background: "#f2f2f2",
            padding: "0.3rem 1rem",
            border: "1px solid #5D5D5D",
            borderRadius: "4px",
            cursor: "pointer",
            color: "#5D5D5D",
          }}
        >
          {isPaused ? "▶️" : "| |"}
          <span
            style={{
              position: "absolute",
              marginLeft: "0.05rem",
              bottom: "1.25rem",
              background: "#618be4",
              color: "white",
              padding: "0.2rem 0.5rem",
              borderRadius: "25px",
              textAlign: "center",
              cursor: "default",
            }}
          >
            {count}
          </span>
        </button>
      </aside>
    </main>
  );
};
