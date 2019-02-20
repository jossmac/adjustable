# adjustable

> NOTE: This is not ready for production.

Adjustable is a helper to support Tailwind-style utilities for CSS-in-JS.

### Install

```sh
yarn add adjustable
```

### Use

```jsx
import { Adjustable, Adjustment } from "./adjust";
import config from "./config";

const Heading = props => <Adjustment {...props} />;
const H1 = props => <Heading as="h1" css={{ fontSize: 24 }} {...props} />;
const H2 = props => <Heading as="h2" css={{ fontSize: 16 }} {...props} />;

function App() {
  return (
    <Adjustable config={config}>
      <H1 adjust="fg-teal">Teal colored text</H1>
      <H2 adjust="ta-center pb-2 pt-2">
        Centered text with padding top and bottom
      </H2>
    </Adjustable>
  );
}
```

### Config

```js
const colors = {
  ...
  teal: "#4dc0b5",
};

const spacing = ["0", "0.5rem", "1rem", "1.5rem", "2rem"];

export default {
	...
  backgroundColors: colors,
  borderRadius: [0, "0.125rem", "0.25rem", "0.5rem", "50%"],
  fontWeight: [300, 400, 700],
  leading: [1, 1.25, 1.5, 2],
  margin: spacing,
  padding: spacing,
  textColors: colors,
  tracking: ["-0.05em", "0", "0.05em"],
  zIndex: [0, 100, 200, 300, 400, 500]
};
```
