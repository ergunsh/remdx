import { MDXProvider } from '@mdx-js/react';
import { ReMDXModule } from '../types.tsx';
import DefaultComponents from './components/Components.tsx';
import Deck from './deck.tsx';
import Slide from './slide.tsx';

export default async function slidesToComponent(module: Promise<ReMDXModule>) {
  const { Components, Themes, default: slides } = await module;
  return (
    <MDXProvider components={{ ...DefaultComponents, ...Components }}>
      <Deck
        slides={slides.map(({ Component, data }, index) => (
          <Slide
            id={index}
            image={data?.image}
            key={index}
            style={Themes?.[data?.theme] || Themes?.default}
            previousTransition={
              data?.transition || "none"
            }
            nextTransition={
              slides[index + 1]?.data?.transition || "none"
            }
            transition={
              data?.transition ||
              "none"
            }
          >
            <Component />
          </Slide>
        ))}
      />
    </MDXProvider>
  );
}
