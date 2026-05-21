import React from 'react'
import Sidebar from './Sidebar';

function Dashboard() {
  return (
    <>
      <section>
        <div className="d-flex flex-row gap-5">
          <Sidebar />

          <div className="my-5 vh-100">
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Dashboard</h2>
            <p>Welcome to your dashboard!</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Dashboard