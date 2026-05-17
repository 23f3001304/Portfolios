import { Link } from 'react-router-dom';
import { NavPill } from './NavPill.jsx';
import { CommandPalette } from './CommandPalette.jsx';

export function Nav() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand">
          <span className="dot" aria-hidden="true" />
          hemang
        </Link>
        <NavPill />
        <div className="nav-side">
          <CommandPalette />
        </div>
      </div>
    </header>
  );
}
