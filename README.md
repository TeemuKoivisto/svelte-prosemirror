# [svelte-prosemirror](https://github.com/teemukoivisto/svelte-prosemirror)

tl:dr; use Svelte for writing ProseMirror nodes (and hide the boilerplate).

I wanted to find out if I can compile Svelte components into ProseMirror nodes and make my life simpler. Submitted to [SvelteHack 2023](https://hack.sveltesociety.dev/)

## Long explanation

[ProseMirror](prosemirror.net) is a rich-text editing library which is powerful but also a little bit complicated. One particular issue I find with ProseMirorr is the repetition of boilerplate that I think, in places, could be removed. For example, if you want to create a somewhat complicated node you'll write a schema something like:

```ts
export const equationSchema: NodeSpec = {
  attrs: {
    id: { default: undefined },
    title: { default: '' },
    latex: { default: ''}
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
    return ['figure', { id, title, class: 'equation', latex }, ['pre', latex], ['figcaption', {}]]
  }
}
```

As you can see, the deserialization of the node with `parseDOM` and the serialization using `toDOM` appear pretty repetitive. You _can_ of course customize these but I find in 95% of cases you do just something very basic: parse based on a tag OR a tag+class. And next define your output as a `DOMOutputSpec` -> `['figure', ...]` where the first parameter is tag name, the second attributes and the third an optional "hole" where the content goes in.

Writing this can be especially tedious if the attributes belong to multiple nodes, as in the example (which I grant is somewhat contrived), and also if you want to keep them strictly typed to avoid any devious bugs. Combine this with CSS styles that are inside some giant `.css` stylesheet and you got yourself a pretty big mess.

## My idea

Being frustrated by all of this, I wanted to figure out how to minimize the repetition. When you think about it, the answer is pretty simple. We are dealing with HTML fragments here. Why not then just HTML instead? Even better, why not use a framework that _combines_ this HTML with your CSS and in general, makes everything just nice and cohesive.

Obviously, I thought Svelte was the best choice so what I did was define a Svelte component (in addition to the regular ProseMirror schema) which included the serialized HTML as well as the related styles - all in a single file.

Here's the same example written as `Equation.svelte` component:

```ts

```

The ProseMirror `ParseRule`s and `DOMOutputSpec`s are generated behind the scenes by rendering the Svelte component on mount into DOM, then recursing it to turn it back into a ProseMirror `NodeSpec` by extracting the attributes from DOM based on the defined default attributes. It doesn't allow reusing the same attribute in multiple DOM nodes and the whole compilation step should be done during builld time but hey, works for this prototype! Also, since all is still in standard ProseMirror schema there is no performance-penalty whatsoever - it's all syntactic sugar. So you could say this is a very hackish Svelte to ProseMirror compiler.

I attempted to use `<slot>` for the content hole but since I could not extract them from the Svelte component, I went with this `data-hole` attribute instead. 

The styles are encapsulated pretty nicely and typing works solidly as you use the same interface for the Svelte component as you do for the ProseMirror schema.

This is the main contribution of this submission to SvelteHack 2023 https://hack.sveltesociety.dev/

## Extras

Since I have been crunching this problem for some time now, I also wanted to come up with the simplest editor architecture to divide my ProseMirror editor into extensions. There are many frameworks that do this, such as TipTap or Remirror, but I've long thought it can be made more simple.

In addition to this, I've made a wrapper to use these Svelte components as extensions as simply as possible. Instead of using classes like all the other contemporaries I'm leveraging the new TypeScript `satisfies` operator that allows type-checking the objects making the extensions super-lean and easy to understand. No inheritance, no leaky abstractions!

I think I've also found out how to do this now that TypeScript announced `satisfies` operator in 4.9. So instead of using some super-class I can use an object:

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

which makes extending/reusing the extensions pretty damn straighforward _and_ you also maintain the shape of the object. Whereas with an `Extension` class you'd just see a generic `Extension` as you've typed it as `Extension`, with an object literal VSCode shows when you check the type almost the original thing:

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

Which I think is pretty neat. No inheritance - no leaky abstractions!

## And there's even more

It's pretty common to wrap your interactive UI logic that you embed inside ProseMirror nodes using React, Vue or Svelte. So there's nothing new that I'm doing here.

However, since I am using the same component layout in the NodeView as in the Svelte-to-Prosemirror component - only difference being additional attributes - 






The Svelte-based DOM nodes come with various limitations due to the fact that they are rendered by ProseMirror and not by Svelte. Thus, if you want anything interactive that's not intercepted and canceled by ProseMirror, you need to use NodeViews. NodeViews allow you to create DOM fragments that contain your own interactive UI widgets and whatnot. It's pretty common practise to use a framework, such as React, Vue or Svelte, to render these NodeViews to allow leveraging complex UI libraries so it's not a huge contribution of this project.

But since you're already using Svelte components for nodes it's rather intuitive to, when you need to add more interactivity to a node, to transform it to a NodeView component that has similar but extended props to use.

In my mind, Svelte is quite the optimal match for ProseMirror since neither use a shadow DOM render engine, like React or Vue, and instead rely on performing xxx to see what DOM have changed and need to be updated.

Also since I'm using solely Svelte for the whole framework I can easily integrate 


I think here are the building blocks of one awesome Svelte-first rich-text editor framework that opens up a great deal of productivity as it does not try to satisfy all the constraints of various frontend frameworks out there but focuses exclusively on leveraging Svelte.

## Moving forward

It would be awesome to develop this bridge even further but there's a bit too much here for one person to do on a few spare hours per week.

If there are any enthusiastic contributors willing to help to prototype and contribute by for example porting extensions from other frameworks, I'm more than happy to help! Here could be the makings for one awesome Svelte rich-text editor framework.

## How to run

1. `pnpm i`
2. `pnpm -r --no-bail build`
3. `pnpm client`
4. Should open the site at http://localhost:5175/
