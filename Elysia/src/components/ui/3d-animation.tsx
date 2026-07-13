import React, { useEffect, useRef } from "react";

interface PoemAnimationProps {
  poemHTML: string;
  backgroundImageUrl: string;
  boyImageUrl: string;
}

/**
 * Renders the 3D poem animation hero portal — a rotating glass cube of
 * scrolling verse over a cinematic scene, mirrored by a floor reflection.
 */
export const PoemAnimation = ({
  poemHTML,
  backgroundImageUrl,
  boyImageUrl,
}: PoemAnimationProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // This effect handles the responsive scaling of the animation container.
  useEffect(() => {
    function adjustContentSize() {
      if (contentRef.current) {
        const viewportWidth = window.innerWidth;
        const baseWidth = 1000;
        const scaleFactor =
          viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.9 : 1;
        contentRef.current.style.transform = `scale(${scaleFactor})`;
        contentRef.current.style.marginBottom = `${
          (scaleFactor - 1) * 562
        }px`;
      }
    }

    adjustContentSize();
    window.addEventListener("resize", adjustContentSize);
    return () => window.removeEventListener("resize", adjustContentSize);
  }, []);

  return (
    <header className="hero-section" aria-label="Cinematic brand animation">
      <div className="container">
        <div
          ref={contentRef}
          className="content"
          style={{ display: "block", width: "1000px", height: "562px" }}
        >
          <div className="container-full">
            <div className="animated hue"></div>
            <img
              className="backgroundImage"
              src={backgroundImageUrl}
              alt="An old stone courtyard at dawn"
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
            />
            <img
              className="boyImage"
              src={boyImageUrl}
              alt="A man and woman practicing with swords"
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
            />

            <div className="container">
              <div className="cube">
                <div className="face top"></div>
                <div className="face bottom"></div>
                <div
                  className="face left text"
                  dangerouslySetInnerHTML={{ __html: poemHTML }}
                ></div>
                <div
                  className="face right text"
                  dangerouslySetInnerHTML={{ __html: poemHTML }}
                ></div>
                <div className="face front"></div>
                <div
                  className="face back text"
                  dangerouslySetInnerHTML={{ __html: poemHTML }}
                ></div>
              </div>
            </div>

            <div className="container-reflect" aria-hidden="true">
              <div className="cube">
                <div className="face top"></div>
                <div className="face bottom"></div>
                <div
                  className="face left text"
                  dangerouslySetInnerHTML={{ __html: poemHTML }}
                ></div>
                <div
                  className="face right text"
                  dangerouslySetInnerHTML={{ __html: poemHTML }}
                ></div>
                <div className="face front"></div>
                <div
                  className="face back text"
                  dangerouslySetInnerHTML={{ __html: poemHTML }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
