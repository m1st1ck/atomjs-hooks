import { act, renderHook } from "@testing-library/react";
import { asyncAtom } from "@m1st1ck/atomjs";
import { useAtom } from "../src";

type UserAtom = {
  name: string | undefined;
  age: number | undefined;
};

const getUserState = (next: Partial<UserAtom> = {}) => ({
  name: undefined,
  age: undefined,
  ...next,
});

function getAsyncState(
  key: "init" | "loading" | "loaded" | "error",
  errorMessage: string | undefined = undefined
) {
  return {
    init: false,
    loading: false,
    loaded: false,
    error: false,
    errorMessage,
    [key]: true,
  };
}

let userAsyncAtom = asyncAtom<UserAtom>(getUserState());

describe("Atoms Hook", () => {
  beforeEach(() => {
    userAsyncAtom = asyncAtom<UserAtom>(getUserState());
  });

  test("useAtom", () => {
    const { result } = renderHook(() => useAtom(userAsyncAtom));

    expect(result.current[1]).toMatchObject(getAsyncState("init"));
    expect(result.current[0]).toMatchObject(getUserState());

    act(() => {
      userAsyncAtom.setAsyncState({ loading: true }, { age: 44 });
      userAsyncAtom.setAsyncState({ loading: true }, { age: 21 });
    });

    expect(result.current[1]).toMatchObject(getAsyncState("loading"));
    expect(result.current[0]).toMatchObject(getUserState({ age: 21 }));

    act(() => {
      userAsyncAtom.setAsyncState({ loaded: true }, { age: 22 });
    });

    expect(result.current[1]).toMatchObject(getAsyncState("loaded"));
    expect(result.current[0]).toMatchObject(getUserState({ age: 22 }));
  });

  test("useAtom partial", () => {
    const { result } = renderHook(() =>
      useAtom(userAsyncAtom, (prev, next) => prev[1].loaded !== next[1].loaded)
    );

    expect(result.current[1]).toMatchObject(getAsyncState("init"));
    expect(result.current[0]).toMatchObject(getUserState());

    act(() => {
      userAsyncAtom.setAsyncState("loading", { age: 21 });
    });

    expect(result.current[1]).toMatchObject(getAsyncState("init"));
    expect(result.current[0]).toMatchObject(getUserState());

    act(() => {
      userAsyncAtom.setAsyncState("loaded", { age: 21 });
    });

    expect(result.current[1]).toMatchObject(getAsyncState("loaded"));
    expect(result.current[0]).toMatchObject(getUserState({ age: 21 }));
  });
});
