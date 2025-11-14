// app/theme/globalFont.ts
import {Text, TextInput} from "react-native";

export const setGlobalFontFamily = () => {
  const defaultFontFamily = {
    fontFamily: "Geist-Regular"
  };

  // Override Text
  const originalTextRender = (Text as any).render;
  (Text as any).render = function render(props: any, ref: any) {
    props = {
      ...props,
      style: [defaultFontFamily, props.style]
    };
    return originalTextRender.call(this, props, ref);
  };

  // Override TextInput
  const originalTextInputRender = (TextInput as any).render;
  (TextInput as any).render = function render(props: any, ref: any) {
    props = {
      ...props,
      style: [defaultFontFamily, props.style]
    };
    return originalTextInputRender.call(this, props, ref);
  };
};
