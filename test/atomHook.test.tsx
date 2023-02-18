import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { asyncAtom } from "@m1st1ck/atomjs";
import { useAtom } from "../src";

type UserAtom = {
  name: string | undefined;
  age: number | undefined;
};

const getUserState = () => ({
  name: undefined,
  age: undefined,
});

let userAsyncAtom = asyncAtom<UserAtom>(getUserState());

describe("Atoms Hook", () => {
  beforeEach(() => {
    userAsyncAtom = asyncAtom<UserAtom>(getUserState());
  });

  test("useAtom", () => {
    const App = () => {
      const [user, { loaded, loading, init }] = useAtom(userAsyncAtom);

      return (
        <div>
          {init && <div data-testid="state">init</div>}
          {loading && <div data-testid="state">loading</div>}
          {loaded && <div data-testid="state">loaded</div>}
          <span data-testid="age-container">{user.age}</span>
          <button
            data-testid="age-button"
            onClick={() => {
              userAsyncAtom.setAsyncState({ loading: true }, { age: 21 });
            }}
          />
          <button
            data-testid="button"
            onClick={() => {
              userAsyncAtom.setAsyncState({ loaded: true }, { age: 22 });
            }}
          />
        </div>
      );
    };

    const { getByTestId } = render(<App />);

    expect(getByTestId("state")).toHaveTextContent("init");
    expect(getByTestId("age-container")).not.toHaveTextContent("21");
    expect(getByTestId("age-container")).not.toHaveTextContent("22");

    fireEvent.click(getByTestId("age-button"));

    expect(getByTestId("state")).toHaveTextContent("loading");
    expect(getByTestId("age-container")).toHaveTextContent("21");

    fireEvent.click(getByTestId("button"));

    expect(getByTestId("state")).toHaveTextContent("loaded");
    expect(getByTestId("age-container")).toHaveTextContent("22");
  });

  test("useAtom partial", () => {
    const App = () => {
      const [user, { loaded, loading, init }] = useAtom(
        userAsyncAtom,
        (prev, next) => prev[1].loaded !== next[1].loaded
      );

      return (
        <div>
          {init && <div data-testid="state">init</div>}
          {loading && <div data-testid="state">loading</div>}
          {loaded && <div data-testid="state">loaded</div>}
          <span data-testid="age-container">{user.age}</span>
          <button
            data-testid="age-button"
            onClick={() => {
              userAsyncAtom.setAsyncState({ loading: true }, { age: 21 });
            }}
          />
          <button
            data-testid="button"
            onClick={() => {
              userAsyncAtom.setAsyncState({ loaded: true }, { age: 22 });
            }}
          />
        </div>
      );
    };

    const { getByTestId } = render(<App />);

    expect(getByTestId("state")).toHaveTextContent("init");
    expect(getByTestId("age-container")).not.toHaveTextContent("21");
    expect(getByTestId("age-container")).not.toHaveTextContent("22");

    fireEvent.click(getByTestId("age-button"));

    expect(getByTestId("state")).toHaveTextContent("init");
    expect(getByTestId("age-container")).not.toHaveTextContent("21");

    fireEvent.click(getByTestId("button"));

    expect(getByTestId("state")).toHaveTextContent("loaded");
    expect(getByTestId("age-container")).toHaveTextContent("22");
  });
});
