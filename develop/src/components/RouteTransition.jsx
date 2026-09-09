import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/* How long the outgoing page gets before it is replaced. Short on purpose: a
 * long exit is a long wait, and the incoming animation is what people read as
 * "the page changed". Keep in step with .route-out in transitions.css. */
const OUT_MS = 180;

/* Cross-fades one page out before the next mounts.
 *
 * React Router renders the new route the instant the URL changes, so there is
 * nothing left to animate out. The fix is a frozen location: <Routes> keeps
 * rendering `held` while the real location has already moved on, the old
 * markup plays .route-out against it, and only then does `held` catch up and
 * the new page mount with .route-in. `children` is a function so the frozen
 * location can be handed to <Routes location=...> - App still owns the routes.
 */
export function RouteTransition({ children }) {
  const location = useLocation();
  const [held, setHeld] = useState(location);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (location.pathname === held.pathname) return;
    setLeaving(true);
    const t = setTimeout(() => {
      setHeld(location);
      setLeaving(false);
    }, OUT_MS);
    return () => clearTimeout(t);
  }, [location, held.pathname]);

  /* A new page starts at the top. Lenis owns the scroll position while it is
   * running, and moving window.scrollY behind its back leaves it convinced you
   * are still where you were - so ask Lenis when it is there, and fall back to
   * the window when it is not (reduced motion, or before it mounts). An
   * anchored link is the exception: something else is about to scroll to it. */
  useEffect(() => {
    if (held.hash) return;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [held]);

  return (
    <div key={held.key} className={`route-swap ${leaving ? 'route-out' : 'route-in'}`}>
      {children(held)}
    </div>
  );
}
