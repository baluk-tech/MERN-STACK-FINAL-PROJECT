import React, { useState, useEffect } from 'react';
import instance from '../Utils/Middleware';
import { useAuth } from '../Components/Authcontext';
import { useNavigate } from 'react-router-dom';
// Graph-kaga Recharts import pandrom
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Admindashboard() {
    const [totalUsers, setTotalUsers] = useState(0); 
    const [totalOrders, setTotalOrders] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [graphData, setGraphData] = useState([]); // Graph data-kaga puthu state

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        // Fetch Users
        instance.get('/admin/users').then((res) => {
            setTotalUsers(res.data.users?.length || 0);
        }).catch(console.error);

        // Fetch Orders, Revenue & Prepare Graph Data
        instance.get('/orders/admin/all-orders').then((res) => {
            const orders = res.data.orders || [];
            setTotalOrders(orders.length);
            setRevenue(orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0));

            // --- GRAPH LOGIC: Kadantha 6 maasathoda Data-va pirikirom ---
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthlyData = {};

            // Muthalla last 6 months-a 0 revenue nu set pandrom
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                monthlyData[monthKey] = { name: monthNames[d.getMonth()], Revenue: 0, Orders: 0 };
            }

            // Orders-a antha antha maasathukku yetha mathiri add pandrom
            orders.forEach(order => {
                const d = new Date(order.createdAt);
                const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                if (monthlyData[monthKey]) {
                    monthlyData[monthKey].Revenue += (order.totalAmount || 0);
                    monthlyData[monthKey].Orders += 1;
                }
            });

            setGraphData(Object.values(monthlyData));
        }).catch(console.error);
    }, []);

  return (
    <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 border-0">
      
      <div className="mb-5 pb-3 border-bottom">
        <h2 className="fw-bold mb-2" style={{ color: 'var(--purple)' }}>Dashboard Overview</h2>
        <p className="text-muted mb-0">Welcome back, Admin! Here is your tailoring business summary.</p>
      </div>

      {/* --- TOP 3 CARDS --- */}
      <div className="row g-4 mb-5">
        {/* Users Card */}
        <div className="col-md-4">
          <div className="card border-0 bg-primary-subtle rounded-4 p-2 shadow-sm h-100 transition-hover">
            <div className="card-body d-flex align-items-center gap-4">
              <div className="bg-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '65px', height: '65px' }}>
                <i className="bi bi-people-fill fs-3 text-primary"></i>
              </div>
              <div>
                <p className="text-muted fw-bold mb-1 small text-uppercase tracking-wide">Total Users</p>
                <h2 className="fw-bold mb-0 text-dark">{totalUsers}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="col-md-4">
          <div className="card border-0 bg-warning-subtle rounded-4 p-2 shadow-sm h-100 transition-hover">
            <div className="card-body d-flex align-items-center gap-4">
              <div className="bg-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '65px', height: '65px' }}>
                <i className="bi bi-box-seam-fill fs-3 text-warning"></i>
              </div>
              <div>
                <p className="text-muted fw-bold mb-1 small text-uppercase tracking-wide">Total Orders</p>
                <h2 className="fw-bold mb-0 text-dark">{totalOrders}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="col-md-4">
          <div className="card border-0 bg-success-subtle rounded-4 p-2 shadow-sm h-100 transition-hover">
            <div className="card-body d-flex align-items-center gap-4">
              <div className="bg-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '65px', height: '65px' }}>
                <i className="bi bi-currency-rupee fs-3 text-success"></i>
              </div>
              <div>
                <p className="text-muted fw-bold mb-1 small text-uppercase tracking-wide">Total Revenue</p>
                <h2 className="fw-bold mb-0 text-dark">₹{revenue.toLocaleString()}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- REVENUE GRAPH SECTION --- */}
      <div className="bg-white p-4 rounded-4 shadow-sm border border-light-subtle">
        <h5 className="fw-bold mb-4" style={{ color: 'var(--purple)' }}>Revenue Overview (Last 6 Months)</h5>
        
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {/* Graph-oda color gradient (Purple to transparent) */}
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6f42c1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6f42c1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#a0a0a0" tick={{ fill: '#6c757d' }} />
              <YAxis stroke="#a0a0a0" tick={{ fill: '#6c757d' }} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <Tooltip 
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`₹${value}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="Revenue" stroke="#6f42c1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

export default Admindashboard;