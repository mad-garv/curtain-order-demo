
import { useState } from "react";

import HomePage from "./pages/HomePage";
import InputPage from "./pages/InputPage";
import OutputPage from "./pages/OutputPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleConfirmOrder = (order) => {
    const newOrder = {
      ...order,
      id: crypto.randomUUID(),
    };

    setOrders((previousOrders) => [
      ...previousOrders,
      newOrder,
    ]);

    setSelectedOrder(newOrder);
    setCurrentPage("output");
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setCurrentPage("output");
  };

  return (
    <>
      {currentPage === "home" && (
        <HomePage
          onStartNewOrder={() => setCurrentPage("input")}
          onViewOrders={() => setCurrentPage("orders")}
          orderCount={orders.length}
        />
      )}

      {currentPage === "input" && (
        <InputPage
          onConfirmOrder={handleConfirmOrder}
        />
      )}

      {currentPage === "orders" && (
        <OrdersPage
          orders={orders}
          onSelectOrder={handleSelectOrder}
          onBack={() => setCurrentPage("home")}
        />
      )}

      {currentPage === "output" && selectedOrder && (
        <OutputPage
          order={selectedOrder}
          onBack={() => setCurrentPage("home")}
        />
      )}
    </>
  );
}

export default App;
