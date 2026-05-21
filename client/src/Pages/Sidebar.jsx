import React from 'react'
import { Link } from 'react-router-dom';

function Sidebar() {

    const sidebarItems = [
        { name: 'My order stats', link: '/my-order-stats' },
        { name: 'Quick actions', link: '/quick-actions' },
        { name: 'Favourite designs', link: '/favourite-designs' },
        { name: 'Recent orders', link: '/recent-orders' },
        { name: 'Ask AI suggestions', link: '/ai-suggestions' },
        { name: 'Settings', link: '/settings' }
    ];

  return (
    <>
      <section>
        <div className="d-flex flex-row">
          <nav className=" my-5 rounded-end-4 p-5" style={{ background: 'var(--background)', color: 'var(--text)' }}>
            <ul className=" flex-column list-unstyled d-flex gap-4">
              {sidebarItems.map((item, index) => (
                <li className="nav-item text-dark" key={index}>
                  <Link className="nav-link" to={item.link}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  )
}

export default Sidebar