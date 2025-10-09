import { TextEncoder, TextDecoder } from "util";

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

const originalWarn = console.warn;
console.warn = (...args) => {
  if (!args[0].includes("outdated JSX transform")) {
    originalWarn(...args);
  }
};