import { defineFeature, loadFeature } from "jest-cucumber";

const getQuoteFeature = loadFeature(
  "src/__tests__/features/quote/get-quote.feature"
);

defineFeature(getQuoteFeature, (test) => {
  test("Upon screen load", ({ given, then }) => {
    given("I am first loaded onto the page", () => {
      expect(0).not.toBe(1);
    });

    then("I should see a random quote by its author.", () => {
      expect(0).not.toBe(1);
    });
  });
});
