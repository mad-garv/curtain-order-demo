
import "./OrdersPage.css";

function OrdersPage({ orders, onSelectOrder, onBack }) {
    return (
        <main className="orders-page">
            <header className="orders-header">
                <div>
                    <h1>Existing Orders</h1>
                    <p>{orders.length} submitted orders</p>
                </div>

                <button onClick={onBack}>Back to Home</button>
            </header>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <h2>No orders yet</h2>
                    <p>Submitted orders will appear here.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => {
                        const windowCount = order.rooms.reduce(
                            (total, room) => total + room.windows.length,
                            0
                        );

                        return (
                            <button
                                className="order-list-card"
                                key={order.id}
                                onClick={() => onSelectOrder(order)}
                            >
                                <div>
                                    <strong>Order {order.orderNo}</strong>
                                    <p>
                                        {order.rooms.length} rooms · {windowCount} windows
                                    </p>
                                </div>

                                <span>View Work Orders →</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </main>
    );
}

export default OrdersPage;