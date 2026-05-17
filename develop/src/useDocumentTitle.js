import { useEffect } from 'react';

const BASE = 'Hemang Choudhary';

/* Sets document.title to `${page} - Hemang Choudhary`, or just the base
   if no page is passed. */
export function useDocumentTitle(page) {
  useEffect(() => {
    const prev = document.title;
    document.title = page ? `${page} - ${BASE}` : `${BASE} - Engineer`;
    return () => { document.title = prev; };
  }, [page]);
}
