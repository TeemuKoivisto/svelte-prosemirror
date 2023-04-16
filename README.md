# [svelte-prosemirror](https://github.com/teemukoivisto/svelte-prosemirror)

tl:dr; use Svelte for writing ProseMirror nodes (and hide the boilerplate).

I wanted to find out if I can compile Svelte components into ProseMirror nodes and make my life simpler. Submitted to [SvelteHack 2023](https://hack.sveltesociety.dev/)

https://teemukoivisto.github.io/svelte-prosemirror/

## Long explanation

[ProseMirror](prosemirror.net) is a rich-text editing library which is powerful but also a little bit complicated. One particular issue I find with ProseMirorr is the repetition of boilerplate that I think, in places, could be removed. For example, if you want to create a somewhat complicated node you'll write a schema something like:

```ts
export const equationSchema: NodeSpec = {
  attrs: {
    id: { default: undefined },
    title: { default: '' },
    latex: { default: '' }
  },
  content: 'inline*',
  group: 'block',
  atom: true,
  parseDOM: [
    {
      tag: 'figure.equation',
      getAttrs: (dom: HTMLElement | string) => {
        if (dom instanceof HTMLElement) {
          return {
            id: dom.getAttribute('id'),
            title: dom.getAttribute('title'),
            latex: dom.getAttribute('latex')
          }
        }
        return null
      }
    }
  ],
  toDOM(node: PMNode) {
    const { id, title, latex } = node.attrs
    return ['figure', { id, title, class: 'equation', latex }, ['pre', latex], ['figcaption', 0]]
  }
}
```

As you can see, the deserialization of the node with `parseDOM` and the serialization using `toDOM` appear pretty repetitive. You _can_ of course customize these but I find in 95% of cases you do just something very basic: parse based on a tag OR a tag+class. And next define your output as a `DOMOutputSpec` -> `['figure', ...]` where the first parameter is tag name, the second attributes and the third an optional "hole" where the content goes in.

Writing this can be especially tedious if the attributes belong to multiple nodes, as in the example (which I grant is somewhat contrived), and also if you want to keep them strictly typed to avoid any devious bugs. Combine this with CSS styles that are inside some giant `.css` stylesheet and you got yourself a pretty big mess.

## My idea

Being frustrated by all of this, I wanted to figure out how to minimize the repetition. When you think about it, the answer is pretty simple. We are dealing with HTML fragments here. Why not then just HTML instead? Even better, why not use a framework that _combines_ this HTML with your CSS and in general, makes everything just nice and cohesive.

Obviously, I thought Svelte was the best choice so what I did was define a Svelte component (in addition to the regular ProseMirror schema) which included the serialized HTML as well as the related styles - all in a single file.

There's somewhat similar figure component here https://github.com/TeemuKoivisto/svelte-prosemirror/tree/main/packages/ext-figure/src/lib but without the interactive UI as in here https://github.com/TeemuKoivisto/svelte-prosemirror/blob/main/packages/ext-equation/src/lib/Equation.svelte Basically for figure I used regular ProseMirror nodes (compiled using Svelte) and for the equation a NodeView (DOM rendered inside ProseMirror but managed by you) to make it interactive. Not exactly equivalent but you probably get the idea.

The ProseMirror `ParseRule`s and `DOMOutputSpec`s are generated behind the scenes by rendering the Svelte component on mount into DOM, then recursing it to turn it back into a ProseMirror `NodeSpec` by extracting the attributes from DOM based on the defined default attributes. It doesn't allow reusing the same attribute in multiple DOM nodes and the whole compilation step should be done during builld time but hey, works for this prototype! Also, since all is still in standard ProseMirror schema there is no performance-penalty whatsoever - it's all syntactic sugar. So you could say this is a very hackish Svelte to ProseMirror compiler.

I attempted to use `<slot>` for the content hole but since I could not extract them from the Svelte component, I went with this `data-hole` attribute instead.

The styles are encapsulated pretty nicely and typing works solidly as you use the same interface for the Svelte component as you do for the ProseMirror schema.

This is the main contribution of this submission to SvelteHack 2023 https://hack.sveltesociety.dev/

## Other things

Since I have been crunching this problem for some time now, I also wanted to come up with the simplest editor architecture to divide my ProseMirror editor into extensions and use Svelte for everything. There are many frameworks that do this, such as [TipTap](https://tiptap.dev/) or [Remirror](https://remirror.io/), but I wanted to make something even simpler.

With TypeScript 4.9 came a new `satisfies` operator that I think fits this job perfectly. Using it I was able to ditch the `class`-based approach with inhereritance and just use plain objects:

```ts
import Figcaption, { figcaptionAttrs, figcaptionSchema } from './Figcaption.svelte'
import Figure, { figureAttrs, figureSchema } from './Figure.svelte'
import Image, { imageAttrs, imageSchema } from './Image.svelte'

import type { Extension } from '@my-org/core'

export const figureExtension = () => {
  return {
    name: 'figure' as const,
    nodes: {
      figcaption: {
        attrs: figcaptionAttrs,
        schema: figcaptionSchema,
        component: Figcaption
      },
      figure: {
        attrs: figureAttrs,
        schema: figureSchema,
        component: Figure
      },
      image: {
        attrs: imageAttrs,
        schema: imageSchema,
        component: Image
      }
    }
  } satisfies Extension
}
```

This is pretty cool as you can keep the type-safety as well as make the extensions pretty damn simple. No inheritance - no leaky abstractions. The biggest win (in addition to more flexible format) is being abble to see with VSCode's IntelliSense the original extension with super great detail:

```js
const figureExtension: () => {
    name: "figure";
    nodes: {
        figcaption: {
            attrs: FigcaptionAttrs;
            schema: NodeSpec;
            component: typeof Figcaption;
        };
        figure: {
            attrs: FigureAttrs;
            schema: NodeSpec;
            component: typeof Figure;
        };
        image: {
            attrs: ImageAttrs;
            schema: NodeSpec;
            component: typeof Image;
        };
    };
}
```

There are only few lifecycle hooks I've added to the extensions and I'm pretty happy how it turned out.

## And there's even more

Well since I kinda made a generic editor framework here, there are some additional benefits when you have Svelte as your primary tool. Namely I was able to use `writable`s all around to get really easy to use functions & state https://github.com/TeemuKoivisto/svelte-prosemirror/blob/main/packages/client/src/stores/editor.ts

NodeViews turned out pretty intuitive since I'm using the same props as with the nodes with just few additional ones included: https://github.com/TeemuKoivisto/svelte-prosemirror/blob/main/packages/ext-equation/src/lib/Equation.svelte

## Moving forward

It would be awesome to develop this even further so if there are anyone interested in contributing, we could get the ball rolling.

## How to run

1. `pnpm i`
2. `pnpm -r --no-bail build`
3. `pnpm client`
4. Should open the site at http://localhost:5175/
