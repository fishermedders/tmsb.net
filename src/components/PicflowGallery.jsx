import { useEffect, useRef } from "react";

const TENANT = "tnt_A6m0NCZmYc1zFJku";

export default function PicflowGallery({ id }) {
  const galleryRef = useRef(null);

  useEffect(() => {
    // Inject the Picflow script once across the whole page lifetime
    if (!window.picflow) {
      window.picflow = true;
      const s = document.createElement("script");
      s.src = "https://picflow.com/embed/main.js";
      s.type = "module";
      s.defer = true;
      document.head.appendChild(s);
    }

    // Watch for the embed-badge ad inside (and around) this gallery and
    // remove it as soon as it appears. Using a MutationObserver means we
    // don't need to know exactly when the web component finishes rendering.
    const observer = new MutationObserver(() => {
      const badge = document.querySelector("[name=embed-badge]");
      if (badge) {
        badge.remove();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <picflow-gallery
      ref={galleryRef}
      id={id}
      tenant={TENANT}
      lightbox="#000000E6"
      no-padding="true"
      no-background="true"
      show-cover="true"
    />
  );
}
