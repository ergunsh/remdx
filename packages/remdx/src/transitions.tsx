type TransitionSpec = {
  keyframes: string;
  forwards: string;
  backwards: string;
}

const none: TransitionSpec = {
  keyframes: ``,
  forwards: ``,
  backwards: ``
};

const fadeOut: TransitionSpec = {
  keyframes: `
    @keyframes --fade-out {
      from {
        opacity: 1;
      }

      to {
        opacity: 0;
      }
    }

    @keyframes --fade-in {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }
  `,
  forwards: `
    ::view-transition-old(root) {
      animation: --fade-out 1s ease-in-out;
    }

    ::view-transition-new(root) {
      animation: --fade-in 1s ease-in-out;
    }
  `,
  backwards: `
    ::view-transition-old(root) {
      animation: --fade-out 1s ease-in-out;
    }

    ::view-transition-new(root) {
      animation: --fade-in 1s ease-in-out;
    }
  `
}

const slide: TransitionSpec = {
  keyframes: `
    @keyframes --slide-to-left {
      from {
        transform: translateX(0%)
      }

      to {
        transform: translateX(-100%);
      }
    }

    @keyframes --slide-from-right {
      from {
        transform: translateX(100%);
      }

      to {
        transform: translateX(0%);
      }
    }

    @keyframes --slide-to-right {
      from {
        transform: translateX(0%);
      }

      to {
        transform: translateX(100%);
      }
    }

    @keyframes --slide-from-right {
      from {
        transform: translateX(100%);
      }

      to {
        transform: translateX(0%);
      }
    }

    @keyframes --slide-from-left {
      from {
        transform: translateX(-100%);
      }

      to {
        transform: translateX(0%);
      }
    }
  `,
  forwards: `
    ::view-transition-old(root) {
      animation: --slide-to-left 1s ease-in-out;
    }

    ::view-transition-new(root) {
      animation: --slide-from-right 1s ease-in-out;
    }
  `,
  backwards: `
    ::view-transition-old(root) {
      animation: --slide-to-right 1s ease-in-out;
    }

    ::view-transition-new(root) {
      animation: --slide-from-left 1s ease-in-out;
    }
  `
}

const fadeAndScale: TransitionSpec = {
  keyframes: `
    @keyframes fade-and-scale-in {
      from {
        opacity: 0;
        transform: scale(0);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes fade-and-scale-out {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0);
      }
    }`,
  forwards: `
    ::view-transition-old(root) {
      animation: fade-and-scale-out 0.5s ease-in-out 1 forwards;
    }
    ::view-transition-new(root) {
      animation: fade-and-scale-in 0.5s ease-in-out 1 forwards;
    }
  `,
  backwards: `
    ::view-transition-old(root) {
      animation: fade-and-scale-out 0.5s ease-in-out 1 forwards;
    }
    ::view-transition-new(root) {
      animation: fade-and-scale-in 0.5s ease-in-out 1 forwards;
    }
  `
}

export const Transitions: Record<string, TransitionSpec> = {
  fadeOut,
  fadeAndScale,
  slide,
  none,
};
