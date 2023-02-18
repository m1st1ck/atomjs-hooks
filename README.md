# AtomJS React

React hook for atomjs

## Install

```javascript

npm install @m1st1ck/atomjs
npm install @m1st1ck/atomjs-react

```

## useAtom\<T\>(atom: ObservableAtom<T>, shouldUpdate?: (prev: T, next: T) => boolean): T
```javascript
import { asyncAtom, atom } from "@m1st1ck/atomjs";
import { useAtom } from "@m1st1ck/atomjs-react";

const nameAtom = asyncAtom("Stad");
const countAtom = atom(0);
// listen for state changes and rerender component
const [name, { loading }] = useAtom(nameAtom);
const count = useAtom(countAtom);
```

### Custom equality
```javascript
const userAtom = atom({ name: "Stad", age: 3 });
// rerender only if age was changed
const user = useAtom(userAtom, (prev, next) => prev.age !== next.age);
```
