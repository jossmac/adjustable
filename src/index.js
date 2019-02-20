/** @jsx jsx */

import React, { useContext } from "react";
import { jsx } from "@emotion/core";

export const AdjustContext = React.createContext();
export const Adjustable = ({ config, ...props }) => (
  <AdjustContext.Provider value={config} {...props} />
);

const merge = (acc, obj) => ({ ...obj, ...acc });
const diff = (a, b) => a.filter(i => b.indexOf(i) < 0);
const objectMap = (object, mapFn) => {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFn(object[key], key);
    return result;
  }, {});
};

const color = {
  bg: "backgroundColor",
  fg: "color"
};
const font = {
  ff: "fontFamily",
  fs: "fontSize",
  fw: "fontWeight",
  ta: "textAlign",
  td: "textDecoration",
  ls: "letterSpacing",
  lh: "lineHeight"
};
const margin = {
  mb: "marginBottom",
  ml: "marginLeft",
  mr: "marginRight",
  mt: "marginTop"
};
const padding = {
  pb: "paddingBottom",
  pl: "paddingLeft",
  pr: "paddingRight",
  pt: "paddingTop"
};
const size = {
  h: "height",
  w: "width"
};

const declarationMap = {
  br: "borderRadius",
  ...color,
  ...font,
  ...padding,
  ...margin,
  ...size
};

const configMap = {
  backgroundColor: "backgroundColors",
  color: "textColors",
  fontFamily: "fontFamily",
  fontSize: "fontSize",
  fontWeight: "fontWeight",
  height: "height",
  letterSpacing: "tracking",
  lineHeight: "leading",
  marginBottom: "margin",
  marginLeft: "margin",
  marginRight: "margin",
  marginTop: "margin",
  paddingBottom: "padding",
  paddingLeft: "padding",
  paddingRight: "padding",
  paddingTop: "padding",
  width: "width"
};

const useAbbreviation = abb => {
  const context = useContext(AdjustContext);
  const config = objectMap(configMap, result => context[result] || result);
  const [p, v] = abb.split("-");
  const property = declarationMap[p];
  const stringOrIndex = isNaN(v) ? v : parseInt(v, 10);
  const value = config[property]
    ? config[property][stringOrIndex]
    : stringOrIndex;

  if (!property) {
    throw new Error(
      `Couldn't find matching property for "${p}"". The accepted abbreviations are: ${Object.entries(
        declarationMap
      )
        .map(([k, v]) => `\n${k}: ${v}`)
        .join()}.`
    );
  }

  return { [property]: value };
};

const makeCSS = str => {
  const abbreviations = str.split(" ");
  const pseudos = abbreviations.filter(a => a.includes(":"));
  const normies = diff(abbreviations, pseudos);

  const normalRules = normies.map(useAbbreviation);
  let pseudoObj = {};

  // hacky?
  if (pseudos.length) {
    pseudos.forEach(r => {
      const [key, value] = r.split(":");
      const pk = `&:${key}`;

      if (!pseudoObj[pk]) pseudoObj[pk] = [];
      pseudoObj[pk].push(useAbbreviation(value));
    });
  }

  const normalRuleObj = normalRules.reduce(merge, {});
  const pseudoRuleObj = objectMap(pseudoObj, res => res.reduce(merge, {}));

  return { ...normalRuleObj, ...pseudoRuleObj };
};

export const Adjustment = React.forwardRef(
  ({ adjust, as: Tag, ...props }, ref) => {
    const adjustmentCSS = adjust ? makeCSS(adjust) : null;

    return <Tag css={adjustmentCSS} {...props} />;
  }
);

Adjustment.defaultProps = {
  as: "div"
};
