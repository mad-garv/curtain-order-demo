
import WorkOrder from "../components/WorkOrder";
import "./OutputPage.css";

function OutputPage({ order, onBack }) {
    const totalWindows = order.rooms.reduce(
        (total, room) => total + room.windows.length,
        0
    );

    return (
        <main className="output-page">
            <header className="output-header">
                <div>
                    <h1>Work Orders</h1>
                    <p>Order No: {order.orderNo}</p>
                    <p>{totalWindows} individual work orders</p>
                </div>

                <button className="output-back-button" onClick={onBack}>
                    Back
                </button>
            </header>

            <div className="work-orders-list">
                {order.rooms.map((room, roomIndex) =>
                    room.windows.map((window, windowIndex) => (
                        <WorkOrder
                            key={`${roomIndex}-${windowIndex}`}
                            room={room}
                            window={window}
                        />
                    ))
                )}
            </div>
        </main>
    );
}

export default OutputPage;