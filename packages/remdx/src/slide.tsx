import {
  CSSProperties,
  ReactNode,
  Suspense,
  useContext,
  useEffect,
} from 'react';
import { flushSync } from 'react-dom';
import { useSwipeable } from 'react-swipeable';
import { DeckContext } from './deck.tsx';
import { Transitions } from './transitions.tsx';
import { GOTO_FINAL_STEP } from './hooks/use-deck-state.tsx';

enum SlideDirection {
  forwards,
  backwards
}

export default function Slide({
  children,
  className,
  id,
  image,
  padding = 48,
  style,
  previousTransition: previousTransitionName,
  nextTransition: nextTransitionName,
}: {
  children: ReactNode;
  className?: string;
  id: number;
  image?: string;
  padding?: string | number;
  style?: CSSProperties;
  previousTransition?: string;
  nextTransition?: string;
  transition?: string;
}): JSX.Element {
  const {
    activeView,
    advanceSlide,
    cancelTransition,
    commitTransition,
    navigationDirection,
    onSwiped,
    pendingView,
    regressSlide,
    slideCount,
  } = useContext(DeckContext);

  const isActive = activeView.slideIndex === id;
  const isPending = pendingView.slideIndex === id;

  const willEnter = !isActive && isPending;
  const willExit = isActive && !isPending;
  const slideWillChange = activeView.slideIndex !== pendingView.slideIndex;
  const stepWillChange = activeView.stepIndex !== pendingView.stepIndex;

  useEffect(() => {
    if (!isActive || !stepWillChange || slideWillChange) {
      return;
    }

    let slideDirection: SlideDirection = SlideDirection.forwards;
    if (pendingView.stepIndex < 0) {
      slideDirection = SlideDirection.backwards;
    } else if (pendingView.stepIndex > 0) {
      slideDirection = SlideDirection.forwards;
    } else if (pendingView.stepIndex === GOTO_FINAL_STEP) {
      slideDirection = SlideDirection.forwards;
    }

    const updateState = () => {
      if (pendingView.stepIndex < 0) {
        regressSlide();
      } else if (pendingView.stepIndex > 0) {
        advanceSlide();
      } else if (pendingView.stepIndex === GOTO_FINAL_STEP) {
        commitTransition({
          stepIndex: 0,
        });
      } else {
        commitTransition();
      }
    }
    
    let transitionName: string;
    if (slideDirection === SlideDirection.forwards) {
      transitionName = nextTransitionName || "none";
    } else {
      transitionName = previousTransitionName || "none";
    }

    if (!transitionName || transitionName === "none" || !(transitionName in Transitions)) {
      updateState();
    } else {
      const addTransitionStyles = () => {
        const transition = Transitions[transitionName];
        const transitionStylesheet = new CSSStyleSheet();
        transitionStylesheet.replaceSync(`
          ${transition.keyframes}
          ${slideDirection === SlideDirection.forwards ? transition.forwards : transition.backwards}
        `);
        
        document.adoptedStyleSheets = [transitionStylesheet];
  
        return () => {
          document.adoptedStyleSheets = [];
        }
      };
  
      const removeTransitionStyles = addTransitionStyles();
      // @ts-ignore
      const documentTransition = document.startViewTransition(() => {
        flushSync(() => updateState());
      });
  
      documentTransition.finished.then(() => {
        removeTransitionStyles?.();
      });
    }
  }, [
    advanceSlide,
    commitTransition,
    navigationDirection,
    isActive,
    pendingView,
    regressSlide,
    slideWillChange,
    stepWillChange,
  ]);

  useEffect(() => {
    if (!willExit) {
      return;
    }
    if (
      pendingView.slideIndex === undefined ||
      pendingView.slideIndex > slideCount - 1
    ) {
      cancelTransition();
    }
  }, [
    cancelTransition,
    pendingView,
    navigationDirection,
    willExit,
    slideCount,
  ]);

  useEffect(() => {
    if (!willEnter) {
      return;
    }

    if (pendingView.stepIndex === GOTO_FINAL_STEP) {
      commitTransition({
        stepIndex: 0,
      });
    } else {
      commitTransition();
    }
  }, [
    activeView,
    commitTransition,
    navigationDirection,
    pendingView,
    willEnter,
  ]);

  const swipeHandler = useSwipeable({
    onSwiped: (eventData) => onSwiped(eventData),
  });

  return (
    <div
      style={{
        background: 'transparent',
        height: '100%',
        position: 'absolute',
        width: '100%',
        ...(isActive ? { display: 'unset' } : { display: 'none' }),
      }}
    >
      <div
        className={className}
        style={{
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          zIndex: '0',
          ...style,
          ...(image ? { backgroundImage: `url('${image}')` } : null),
        }}
        {...swipeHandler}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding,
          }}
        >
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </div>
  );
}
