import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Lightbox } from './Lightbox.jsx';

/*
 * Lightbox context. Each <Figure src=.../> registers itself on mount, gets an
 * unregister callback, and can request the lightbox open at its image. The
 * lightbox itself reads the registered list + active index from this context,
 * so navigating between images (prev/next) walks every image currently on the
 * page. Items live in a ref to keep register identity stable across renders.
 */
const Ctx = createContext(null);

export function useLightbox() {
  return useContext(Ctx);
}

export function LightboxProvider({ children }) {
  const itemsRef = useRef([]);
  const [version, bump] = useState(0); // forces re-read of itemsRef on changes
  const [activeId, setActiveId] = useState(null);

  const register = useCallback((item) => {
    itemsRef.current = [
      ...itemsRef.current.filter((x) => x.id !== item.id),
      item,
    ];
    bump((v) => v + 1);
    return () => {
      itemsRef.current = itemsRef.current.filter((x) => x.id !== item.id);
      bump((v) => v + 1);
    };
  }, []);

  const open = useCallback((id) => { if (id != null) setActiveId(id); }, []);
  const close = useCallback(() => setActiveId(null), []);
  const step = useCallback((delta) => {
    setActiveId((cur) => {
      const list = itemsRef.current;
      if (!list.length) return null;
      const i = list.findIndex((x) => x.id === cur);
      const j = ((i < 0 ? 0 : i + delta) % list.length + list.length) % list.length;
      return list[j].id;
    });
  }, []);
  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  // If the active image gets unregistered (route change, etc.), close cleanly.
  useEffect(() => {
    if (activeId && !itemsRef.current.some((x) => x.id === activeId)) setActiveId(null);
  }, [activeId, version]);

  const value = useMemo(() => ({
    items: itemsRef.current,
    activeId,
    register,
    open,
    close,
    prev,
    next,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [activeId, version, register, open, close, prev, next]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <Lightbox />
    </Ctx.Provider>
  );
}
