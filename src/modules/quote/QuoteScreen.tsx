import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../core/store";

import * as presenter from "./quotes-presenter";

export const QuoteScreen = () => {
  const [count, setCount] = useState(7);
  const countRef = useRef(count);

  const [isPaused, setIsPaused] = useState(false);

  const [prevColor, setPrevColor] = useState({ color: "#f2f2f2", index: 0 });

  const [newColor, setNewColor] = useState({ color: "pink", index: 1 });

  const [backgroundPosition, setBackgroundPosition] = useState<{
    X: "right" | "left";
    Y: "bottom" | "top";
  }>({
    X: "right",
    Y: "bottom",
  });

  const [transition, setTransition] = useState<
    "background-position 0.7s ease" | "none"
  >("background-position 0.7s ease");

  const dispatch = useAppDispatch();

  const quoteVm = useAppSelector(presenter.selectQuoteVm);

  const quoteStatus = useAppSelector(presenter.selectQuoteStatus);

  const getRandomIndex = (arr: unknown[]) => {
    return Math.floor(Math.random() * arr.length);
  };

  const setRandomColor = () => {
    setBackgroundPosition({
      X: "right",
      Y: "bottom",
    });
    setTransition("none");

    const colors = ["#f2f2f2", "pink", "#94287D", "lightblue", "#AB7506"];

    let randomIndex = 0;
    do {
      randomIndex = getRandomIndex(colors);
    } while (randomIndex === prevColor.index);

    const nextColor = { color: colors[randomIndex], index: randomIndex };

    setPrevColor((currentPrevColor) => {
      setNewColor({ ...currentPrevColor });

      return nextColor;
    });

    setTimeout(() => {
      setBackgroundPosition({
        X: "left",
        Y: "top",
      });
      setTransition("background-position 0.7s ease");
    }, 700);
  };

  const loadRandomQuote = () => {
    setRandomColor();

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
  };

  const quoteBtnStyles: React.CSSProperties = {
    background: "#5dc55d",
    color: "white",
  };

  return (
    <main
      id="quotecontainer"
      style={{
        backgroundImage: `linear-gradient(45deg, ${newColor.color} 50%, ${prevColor.color} 50%)`,
        backgroundPosition: `${backgroundPosition.X} ${backgroundPosition.Y}`,
        transition,
      }}
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
