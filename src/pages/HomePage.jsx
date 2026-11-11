
import "./HomePage.css";

function HomePage({ onStartNewOrder, onViewOrders, orderCount }) {
    return (
        <main className="home-page">
            <div className="home-content">
                <h1>Curtain Work Orders</h1>
                <p>Manage customer orders and generate work orders.</p>

                <div className="home-actions">
                    <button onClick={onStartNewOrder}>
                        <span>＋</span>
                        <strong>Start New Order</strong>
                        <small>Create a new customer order</small>
                    </button>

                    <button onClick={onViewOrders}>
                        <span>☷</span>
                        <strong>View Orders</strong>
                        <small>{orderCount} submitted orders</small>
                    </button>
                </div>
            </div>
        </main>
    );
}

export default HomePage;