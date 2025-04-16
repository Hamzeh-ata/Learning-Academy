export const OrderItems = ({ orderItems }) => (
  <div>
    {orderItems?.map((order, index) => (
      <div key={order.id} className="text-gray-300 flex flex-col gap-2 border-b mb-2 pb-3 border-b-slate-600">
        <p>Order {index + 1}: </p>
        <div className="flex flex-col px-4 gap-4 py-4 shadow-md bg-slate-900 rounded-md">
          <p>
            Name: <span className="text-white">{order.name}</span>
          </p>
          <p>
            Price: <span className="text-white">{order.price}JOD</span>
          </p>
          <p>
            Type: <span className="text-white">{order.type}</span>
          </p>
          <p>
            Arkan Code: <span className="text-white">{order.code ? order.code : 'Not found'}</span>
          </p>
        </div>
      </div>
    ))}
  </div>
);
