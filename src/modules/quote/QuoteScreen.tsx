import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../core/store";
import { Counter } from "./Counter";
import * as presenter from "./quotes-presenter";

type ThemeKeys = "primary" | "secondary" | "tertiary" | "quaternary";

type ThemesType = Record<
  ThemeKeys,
  {
    wipeClass: string;
    quoteClass: string;
    afterWipeClass: string;
  }
>;

export const QuoteScreen = () => {
  const themes: ThemesType = {
    primary: {
      wipeClass: "quote-container--pink",
      quoteClass: "font-bold font-poppins text-1 md-text-2 text-turquoise",
      afterWipeClass: "bg-pink",
    },
    secondary: {
      wipeClass: "quote-container--lavender",
      quoteClass: "font-bold font-playfair text-1 md-text-2 text-olivegreen",
      afterWipeClass: "bg-lavender",
    },
    tertiary: {
      wipeClass: "quote-container--darkgreen",
      quoteClass: "font-bold font-nunito text-1 md-text-2 text-gold",
      afterWipeClass: "bg-darkgreen",
    },
    quaternary: {
      wipeClass: "quote-container--wheat",
      quoteClass: "font-bold font-playfair text-1 md-text-2 text-plum",
      afterWipeClass: "bg-wheat",
    },
  };

  const [prevThemeIndex, setPrevThemeIndex] = useState<number>(0);

  const themeKeys = Object.keys(themes) as ThemeKeys[];

  console.log(Object.keys(themes));

  const [count, setCount] = useState(7);
  const countRef = useRef(count);

  const [isPaused, setIsPaused] = useState(false);

  const [quoteClassName, setQuoteClassName] = useState(
    themes.primary.quoteClass
  );

  const [showWipe, setShowWipe] = useState<boolean>(true);

  const [containerTheme, setContainerTheme] = useState(
    themes.primary.afterWipeClass
  );
  const [wipeTheme, setWipeTheme] = useState(themes.primary.wipeClass);

  const dispatch = useAppDispatch();

  const quoteVm = useAppSelector(presenter.selectQuoteVm);

  const quoteStatus = useAppSelector(presenter.selectQuoteStatus);

  const getRandomIndex = (arr: unknown[], excludeIndex: number) => {
    let randomIndex = null;

    do {
      randomIndex = Math.floor(Math.random() * arr.length);
    } while (randomIndex === excludeIndex);

    return randomIndex;
  };

  const loadRandomQuote = () => {
    setCount(7);

    const randomIndex = getRandomIndex(themeKeys, prevThemeIndex);

    setWipeTheme(themes[themeKeys[randomIndex]].wipeClass);
    setQuoteClassName(themes[themeKeys[randomIndex]].quoteClass);

    console.log("randomIndex: ", randomIndex);

    setShowWipe(true);

    dispatch<any>(presenter.loadQuote());

    setPrevThemeIndex(randomIndex);

    setTimeout(() => {
      setShowWipe(false);
      setContainerTheme(themes[themeKeys[randomIndex]].afterWipeClass);
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
          <p className={quoteClassName}>
            <em>Loading random quote...</em>
          </p>
        </article>
      )}
      {onFailure && (
        <article style={quoteCardStyles}>
          <p className={quoteClassName}>
            We could not get the quote. Please try again later.
          </p>

          <button
            style={quoteBtnStyles}
            onClick={() => {
              loadRandomQuote();
            }}
          >
            Try again
          </button>
        </article>
      )}
      {onSuccess && (
        <article style={quoteCardStyles}>
          <blockquote style={{ fontWeight: "bold" }} className={quoteClassName}>
            {quoteVm?.quote}
            <footer
              className="font-normal text-0 md-text-1"
              style={{ marginTop: "1rem" }}
            >
              - <em>{quoteVm?.author}</em>
            </footer>
          </blockquote>

          <button
            style={quoteBtnStyles}
            onClick={() => {
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
          <Counter count={count} />
        </button>
      </aside>
    </main>
  );
};
