
import { useRef, useState } from "react";
import WorkOrder from "../components/WorkOrder";
import "./OutputPage.css";

function OutputPage({ order, onBack }) {
    const totalWindows = order.rooms.reduce(
        (total, room) => total + room.windows.length,
        0
    );

    const [activeIndex, setActiveIndex] = useState(0);
    const touchStartY = useRef(null);

    const workOrders = order.rooms.flatMap((room, roomIndex) =>
        room.windows.map((window, windowIndex) => ({
            room,
            window,
            id: `${roomIndex}-${windowIndex}`,
        }))
    );

    const handleTouchStart = (event) => {
        touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchEnd = (event) => {
        if (touchStartY.current === null) return;

        const touchEndY = event.changedTouches[0].clientY;
        const difference = touchStartY.current - touchEndY;

        // Swipe upward: next work order
        if (difference > 50) {
            setActiveIndex((current) =>
                Math.min(current + 1, workOrders.length - 1)
            );
        }

        // Swipe downward: previous work order
        if (difference < -50) {
            setActiveIndex((current) =>
                Math.max(current - 1, 0)
            );
        }

        touchStartY.current = null;
    };

    const previousWorkOrder = () => {
        setActiveIndex((current) => Math.max(current - 1, 0));
    };

    const nextWorkOrder = () => {
        setActiveIndex((current) =>
            Math.min(current + 1, workOrders.length - 1)
        );
    };

    return (
        <main
            className="output-page"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
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
                {workOrders.map((workOrder, index) => (
                    <div
                        className={`work-order-item ${
                            index === activeIndex ? "active" : ""
                        }`}
                        key={workOrder.id}
                    >
                        <WorkOrder
                            room={workOrder.room}
                            window={workOrder.window}
                        />
                    </div>
                ))}
            </div>

            <div className="mobile-work-order-navigation">
                <button
                    onClick={previousWorkOrder}
                    disabled={activeIndex === 0}
                >
                    Previous
                </button>

                <span>
                    {activeIndex + 1} / {workOrders.length}
                </span>

                <button
                    onClick={nextWorkOrder}
                    disabled={activeIndex === workOrders.length - 1}
                >
                    Next
                </button>
            </div>
        </main>
    );
}

export default OutputPage;