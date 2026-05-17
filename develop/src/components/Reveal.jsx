import { useReveal } from '../useReveal.js';

export function Reveal({ as: Tag = 'div', children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
