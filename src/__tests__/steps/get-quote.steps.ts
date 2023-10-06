import { defineFeature, loadFeature } from "jest-cucumber";
import { FakeHttpGateway } from "../../core/fake-http-gateway";
import { getQuoteStub } from "../stubs/quote-stub";
import {
  dispatch,
  select,
  initStore,
} from "../support/harnesses/testable-store";
import * as presenter from "../../modules/quote/quotes-presenter";

const getQuoteFeature = loadFeature(
  "src/__tests__/features/quote/get-quote.feature"
);

defineFeature(getQuoteFeature, (test) => {
  beforeEach(async () => {
    const httpGateway = new FakeHttpGateway();

    httpGateway.get = jest.fn().mockImplementation((_path) => {
      return Promise.resolve({ json: () => getQuoteStub() });
    });

    await initStore(httpGateway);
  });

  test("I first visit the page", ({ given, then }) => {
    given("I am on the home page and it's loading.", () => {
      const quoteVm = select(presenter.selectQuote);

      expect(quoteVm.currentQuote).toBe(null);
    });

    then("I should see a random quote by its author.", async () => {
      await dispatch(presenter.loadQuote());

      const quoteVm = select(presenter.selectQuote);

      expect(quoteVm.currentQuote.author).toBe("Unknown");
      expect(quoteVm.currentQuote.quote).toBe('"Lorem ipsum"');
    });
  });
});
