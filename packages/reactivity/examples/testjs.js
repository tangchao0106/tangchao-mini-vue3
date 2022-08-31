const camelize = (str) => {
  return str.replace(/-(\w)/g, (_, c) => {
    console.log("cc==", c);
    return c ? c.toUpperCase() : "";
  });
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const toHandlerKey = (str) => {
  return str ? "on" + capitalize(str) : "";
};

// console.log(camelize("ab-adef"));
console.log(capitalize("ab-adef"));
