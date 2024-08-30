# react-universal-scroll

## Installation

```bash
npm install react-universal-scroll
yarn add react-universal-scroll
pnpm add react-universal-scroll
```

## Features

### `Wheel`, `Touch`, `BarMove`, `Drag` event support

You can disable each behavior by props.

![behavior.gif](docs%2Fimg%2Fbehavior.gif)

### `horizontal` direction support

![horizontal.gif](docs%2Fimg%2Fhorizontal.gif)

## Quick Start

Simply wrap your element with `Scroll` component and pass `dir` prop to it.   
It is going to make your element scrollable in the direction you want.   
`width` or `height` are not required for the `<Scroll>` component if your component inside of `flex` or something layout. (if not, you should set `width` or `height`)

```tsx
<Scroll dir={"vertical"} style={{
    width:150,// if you going to fixed size, set on here
    height:300 
}}>
    <ul>
        <li>Google</li>
        <li>Facebook</li>
        <li>Microsoft</li>
        <li>Apple</li>
        <li>Amazon</li>
        <li>Google</li>
        <li>Facebook</li>
        <li>Microsoft</li>
        <li>Apple</li>
        <li>Amazon</li>
    </ul>
</Scroll>
```

![quick-start.png](docs%2Fimg%2Fquick-start.png)

## Advanced Usage

If you want to use `background`, you can use it in the parent element of the `Scroll` component.   
If not, it will crop by area of `overflow: hidden`.

### background

```tsx
<Scroll
  dir={"vertical"}
  style={
    {
      background: "gray", // set background color here
    }
  }
>
  <ul
    style={{
      // background: "gray", // x don't use background color
    }}
  >
    <li>Google</li>
    <li>Facebook</li>
    <li>Microsoft</li>
    <li>Apple</li>
    <li>Amazon</li>
    <li>Google</li>
    <li>Facebook</li>
    <li>Microsoft</li>
    <li>Apple</li>
    <li>Amazon</li>
  </ul>
</Scroll>
```

![bg-example.png](docs%2Fimg%2Fbg-example.png)

### inline size

If you want to set scroll position to fit the content, make `Scroll` component to `inline`.

```tsx
<Scroll
    dir={"vertical"}
    style={{
        display: "inline-block",
    }}
>
    <ul>
        <li>Google</li>
        <li>Facebook</li>
        <li>Microsoft</li>
        <li>Apple</li>
        <li>Amazon</li>
        <li>Google</li>
        <li>Facebook</li>
        <li>Microsoft</li>
        <li>Apple</li>
        <li>Amazon</li>
    </ul>
</Scroll>
```

![inline.png](docs%2Fimg%2Finline.png)

### Grab options

> By default, grab event change cursor to `grabbing`.

Disable the grab option by passing `false` to the `grab` prop.

```tsx
<Scroll dir={"horizontal"} grab={false}>
    // ...
</Scroll>

// or 

<Scroll dir={"horizontal"} grab={{
    useGrabCursor:true
}}>
    // ...
</Scroll>
```

### Wheel options

```tsx
<Scroll dir={"horizontal"} wheel={false}>
    // ...
</Scroll>
```

The amount of scroll per wheel event and the direction of the scroll can be adjusted.

```tsx
<Scroll dir={"horizontal"} wheel={{
    step:100,
    reverse:false
}}>
    // ...
</Scroll>
```

`step:1`   
![wheel-step-1.gif](docs%2Fimg%2Fwheel-step-1.gif)

`step:100`   
![wheel-step-100.gif](docs%2Fimg%2Fwheel-step-100.gif)

### Full options

```tsx
<Scroll
    style={{
        width: 500,
        background: "#f1f1f1",
    }}
    dir={"horizontal"}
    wheel={{
        step: 30,
        reverse: false,
    }}
    grab={{
        useGrabCursor: true,
    }}
    bar={{
        size: 10,
        marginFromEdge: 3,
        style: {
            background: "#575757",
        },
        track: {
            size: 16,
            style: {
                background: "#bebebe",
            },
        },
    }}
>
// ...    
</Scroll>
```

![full-options.gif](docs%2Fimg%2Ffull-options.gif)
