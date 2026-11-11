
import WorkOrder from "../components/WorkOrder";
import "./OutputPage.css";

function OutputPage({ order, onBack }) {
    const totalWindows = order.rooms.reduce(
        (total, room) => total + room.windows.length,
        0
    );

    const workOrders = order.rooms.flatMap((room, roomIndex) =>
        room.windows.map((window, windowIndex) => ({
            room,
            window,
            id: `${roomIndex}-${windowIndex}`,
        }))
    );

    return (
        <main className="output-page">
            <header className="output-header">
                <div>
                    <h1>Work Orders</h1>
                    <p>Order No: {order.orderNo}</p>
                    <p>{totalWindows} individual work orders</p>
                </div>

                <button
                    className="output-back-button"
                    onClick={onBack}
                >
                    Back
                </button>
            </header>

            <div className="work-orders-list">
                {workOrders.map((workOrder) => (
                    <div
                        className="work-order-item"
                        key={workOrder.id}
                    >
                        <WorkOrder
                            room={workOrder.room}
                            window={workOrder.window}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}

export default OutputPage;
